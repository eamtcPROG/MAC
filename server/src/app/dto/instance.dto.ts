import { ApiProperty } from '@nestjs/swagger';
import { CreateVmDto } from './vm.dto';

export class CreateInstanceDto {
  @ApiProperty({
    example: 't2.micro',
    description: 'The type of the instance',
    type: 'string',
  })
  instanceType!: string;
  @ApiProperty({
    example: 'us-east-1',
    description: 'The region of the instance',
    type: 'string',
  })
  region?: string;
  @ApiProperty({
    example: 'john.doe',
    description: 'The username of the owner',
    type: 'string',
  })
  ownerUsername!: string;
  @ApiProperty({
    example: 'my-vm',
    description: 'The name of the vm',
    type: 'string',
  })
  vmName!: string;
  @ApiProperty({
    example: 1,
    description: 'The minimum number of instances',
    type: 'number',
  })
  minCount?: number;
  @ApiProperty({
    example: 1,
    description: 'The maximum number of instances',
    type: 'number',
  })
  maxCount?: number;
}

export function toCreateInstanceDto(dto: CreateVmDto): CreateInstanceDto {
  return {
    instanceType: dto.instanceType,
    region: dto.region,
    ownerUsername: dto.ownerUsername,
    vmName: dto.vmName,
    minCount: dto.minCount,
    maxCount: dto.maxCount,
  };
}
// Response DTO returned from EC2 describe/run calls
export class InstanceInfoDto {
  instanceId!: string;
  state!: string;
  publicIp?: string;
  privateIp?: string;
  instanceType!: string;
  launchTime?: Date;
  region?: string;
}
