import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { ResultObjectDto } from '../dto/resultobject.dto';
import { VmService } from '../services/vm.service';
import { CreateVmDto, VMDto } from '../dto/vm.dto';
import { ResultListDto } from '../dto/resultlist.dto';
import { InstanceInfoDto } from '../dto/instance.dto';

@Controller()
export class AppController {
  constructor(private readonly vmService: VmService) {}

  @ApiOperation({ summary: 'Register a new vm' })
  @ApiConsumes('application/json')
  @ApiBody({ type: CreateVmDto })
  @ApiOkResponse({
    type: ResultObjectDto<VMDto>,
    description: 'VM created',
  })
  @ApiNotFoundResponse({
    type: ResultObjectDto<null>,
    description: 'VM not found',
  })
  @Post()
  async createInstance(@Body() body: CreateVmDto): Promise<VMDto> {
    return this.vmService.create(body);
  }

  @ApiOperation({ summary: 'Get a list of VMs' })
  @ApiConsumes('application/json')
  @ApiOkResponse({
    type: ResultListDto<VMDto>,
    description: 'List of VMs',
  })
  @ApiQuery({ name: 'page', type: Number, required: false })
  @ApiQuery({ name: 'onpage', type: Number, required: false })
  @Get('/')
  getList(@Query('page') page?: number, @Query('onpage') onPage?: number) {
    return this.vmService.getList(page ?? 1, onPage ?? 10);
  }

  @ApiOperation({ summary: 'Get a VM by entity ID' })
  @ApiOkResponse({ type: ResultObjectDto<VMDto> })
  @ApiNotFoundResponse({ description: 'VM not found' })
  @ApiParam({ name: 'id', description: 'VM entity ID' })
  @Get(':id')
  async getVmById(@Param('id') id: string): Promise<VMDto> {
    const vmId = Number(id);
    if (Number.isNaN(vmId)) {
      throw new NotFoundException('VM not found');
    }
    return this.vmService.findById(vmId);
  }

  @ApiOperation({
    summary: 'Describe EC2 instance by VM entity ID and sync DB',
  })
  @ApiOkResponse({ type: ResultObjectDto<InstanceInfoDto> })
  @ApiNotFoundResponse({ description: 'VM or instance not found' })
  @ApiParam({ name: 'id', description: 'VM entity ID' })
  @Get('/instances/:id')
  async describeByEntity(@Param('id') id: string): Promise<InstanceInfoDto> {
    const vmId = Number(id);
    if (Number.isNaN(vmId)) {
      throw new NotFoundException('VM not found');
    }
    return this.vmService.describeByEntityId(vmId);
  }

  @ApiOperation({ summary: 'Delete a VM and terminate EC2 instance' })
  @ApiOkResponse({ type: VMDto })
  @ApiNotFoundResponse({ description: 'VM not found' })
  @ApiParam({ name: 'id', description: 'VM entity ID' })
  @Delete('/instances/:id')
  async deleteInstance(@Param('id') id: string): Promise<VMDto> {
    const vmId = Number(id);
    if (Number.isNaN(vmId)) {
      throw new NotFoundException('VM not found');
    }
    return this.vmService.delete(vmId);
  }
}
