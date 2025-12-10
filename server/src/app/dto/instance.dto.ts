export class CreateInstanceDto {
  instanceType!: string;
  region?: string;
  ownerUsername!: string;
  vmName!: string;
  minCount?: number;
  maxCount?: number;
}

// Response DTO returned from EC2 describe/run calls
export class InstanceInfoDto {
  instanceId!: string;
  state!: string;
  publicIp?: string;
  privateIp?: string;
  instanceType!: string;
  launchTime?: Date;
}
