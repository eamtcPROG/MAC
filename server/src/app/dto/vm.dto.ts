import { ApiProperty } from '@nestjs/swagger';
import { VM } from '../models/vm.model';

export class CreateVmDto {
  @ApiProperty({ example: 't2.micro', description: 'EC2 instance type' })
  instanceType!: string;

  @ApiProperty({
    example: 'us-east-1',
    description: 'AWS region',
    required: false,
  })
  region?: string;

  @ApiProperty({ example: 'alice', description: 'Owner username' })
  ownerUsername!: string;

  @ApiProperty({ example: 'demo-vm', description: 'Friendly VM name' })
  vmName!: string;

  @ApiProperty({
    example: 1,
    description: 'Minimum number of instances',
    required: false,
  })
  minCount?: number;

  @ApiProperty({
    example: 1,
    description: 'Maximum number of instances',
    required: false,
  })
  maxCount?: number;
}

export class VMDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  instanceId!: string;

  @ApiProperty()
  instanceType!: string;

  @ApiProperty()
  vmName!: string;

  @ApiProperty()
  ownerUsername!: string;

  @ApiProperty()
  region!: string;

  @ApiProperty({ required: false })
  publicIp?: string;

  @ApiProperty({ required: false })
  privateIp?: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

/**
 * Utility to map a VM entity to a VMDto.
 */
export function toVMDto(vm: VM): VMDto {
  return {
    id: vm.id,
    instanceId: vm.instanceId,
    instanceType: vm.instanceType,
    vmName: vm.vmName,
    ownerUsername: vm.ownerUsername,
    region: vm.region,
    publicIp: vm.publicIp,
    privateIp: vm.privateIp,
    createdAt: vm.createdAt,
    updatedAt: vm.updatedAt,
  };
}
