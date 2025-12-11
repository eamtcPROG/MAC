import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VM } from '../models/vm.model';
import { EcService } from './ec.service';
import { CreateVmDto, VMDto, toVMDto } from '../dto/vm.dto';
import { InstanceInfoDto, toCreateInstanceDto } from '../dto/instance.dto';
import { ListDto } from '../dto/list.dto';

@Injectable()
export class VmService {
  constructor(
    @InjectRepository(VM) private readonly repo: Repository<VM>,
    private readonly ecService: EcService,
  ) {}

  /**
   * Validate input, launch EC2 instance, and persist VM record.
   */
  async create(dto: CreateVmDto): Promise<VMDto> {
    const errors: string[] = [];
    if (!dto.instanceType || typeof dto.instanceType !== 'string') {
      errors.push('instanceType is required and must be a string.');
    }
    if (!dto.ownerUsername || typeof dto.ownerUsername !== 'string') {
      errors.push('ownerUsername is required and must be a string.');
    }
    if (!dto.vmName || typeof dto.vmName !== 'string') {
      errors.push('vmName is required and must be a string.');
    }
    if (dto.region && typeof dto.region !== 'string') {
      errors.push('region must be a string when provided.');
    }
    if (
      dto.minCount !== undefined &&
      (!Number.isInteger(dto.minCount) || dto.minCount < 1)
    ) {
      errors.push('minCount must be an integer >= 1 when provided.');
    }
    if (
      dto.maxCount !== undefined &&
      (!Number.isInteger(dto.maxCount) || dto.maxCount < 1)
    ) {
      errors.push('maxCount must be an integer >= 1 when provided.');
    }
    if (errors.length > 0) {
      throw new BadRequestException({ message: 'Validation failed', errors });
    }

    const instance = await this.ecService.runInstances(
      toCreateInstanceDto(dto),
    );

    const vm = this.repo.create({
      instanceId: instance.instanceId,
      instanceType: instance.instanceType,
      vmName: dto.vmName,
      ownerUsername: dto.ownerUsername,
      region: instance.region,
      publicIp: instance.publicIp,
      privateIp: instance.privateIp,
    });

    const saved = await this.repo.save(vm);
    return toVMDto(saved);
  }

  async getList(page: number, onPage: number): Promise<ListDto<VMDto>> {
    const [vms, total] = await this.repo.findAndCount({
      skip: ListDto.skip(page, onPage),
      take: onPage,
    });
    const objects = vms.map((vm) => toVMDto(vm));
    return new ListDto<VMDto>(objects, total, onPage);
  }

  /**
   * Find a VM by its entity ID.
   */
  async findById(id: number): Promise<VMDto> {
    const vm = await this.repo.findOne({ where: { id } });
    if (!vm) {
      throw new NotFoundException('VM not found');
    }
    return toVMDto(vm);
  }

  /**
   * Terminate an EC2 instance and remove the VM record.
   */
  async delete(id: number): Promise<VMDto> {
    const vm = await this.repo.findOne({ where: { id } });
    if (!vm) {
      throw new NotFoundException('VM not found');
    }

    await this.ecService.terminateInstance(vm.instanceId, vm.region);
    await this.repo.remove(vm);
    return toVMDto(vm);
  }

  /**
   * Describe the EC2 instance linked to a VM entity, sync DB fields, and return info.
   */
  async describeByEntityId(id: number): Promise<InstanceInfoDto> {
    const vm = await this.repo.findOne({ where: { id } });
    if (!vm) {
      throw new NotFoundException('VM not found');
    }

    const info = await this.ecService.describeInstance(
      vm.instanceId,
      vm.region,
    );
    if (!info) {
      throw new NotFoundException('Instance not found');
    }

    // Sync selected fields back to the DB
    vm.publicIp = info.publicIp;
    vm.privateIp = info.privateIp;
    vm.instanceType = info.instanceType || vm.instanceType;
    await this.repo.save(vm);

    return { ...info, region: vm.region ?? info.region };
  }
}
