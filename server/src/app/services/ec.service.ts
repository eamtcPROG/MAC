import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  EC2Client,
  RunInstancesCommand,
  DescribeInstancesCommand,
  TerminateInstancesCommand,
  Tag,
  _InstanceType,
} from '@aws-sdk/client-ec2';
import { CreateInstanceDto, InstanceInfoDto } from '../dto/instance.dto';

@Injectable()
export class EcService {
  private clients: Map<string, EC2Client> = new Map();

  constructor(private readonly configService: ConfigService) {}

  private getClient(region?: string): EC2Client {
    const defaultRegion = this.configService.get<string>('ec.region');
    if (!defaultRegion) {
      throw new Error(
        'Region not configured. Please set REGION environment variable.',
      );
    }
    const targetRegion = region || defaultRegion;

    if (!this.clients.has(targetRegion)) {
      const accessKey = this.configService.get<string>('ec.accessKey');
      const secretKey = this.configService.get<string>('ec.secretKey');

      if (!accessKey || !secretKey) {
        throw new Error(
          'AWS credentials not configured. Please set ACCESS_KEY and SECRETE_KEY environment variables.',
        );
      }

      this.clients.set(
        targetRegion,
        new EC2Client({
          region: targetRegion,
          credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
          },
        }),
      );
    }
    return this.clients.get(targetRegion)!;
  }

  /**
   * Creates a new EC2 instance
   * @param params Instance creation parameters
   * @returns Instance information including instance ID and initial state
   */
  async runInstances(params: CreateInstanceDto): Promise<InstanceInfoDto> {
    const {
      instanceType,
      region,
      ownerUsername,
      vmName,
      minCount = 1,
      maxCount = 1,
    } = params;

    const client = this.getClient(region);
    const targetRegion =
      region || this.configService.get<string>('ec.region') || 'us-east-1';
    const amiId = this.configService.get<string>('ec.amiId');
    const securityGroupId =
      this.configService.get<string>('ec.securityGroupId');
    const subnetId = this.configService.get<string>('ec.subnetId');

    if (!amiId) {
      throw new Error(
        'AMI ID not configured. Please set AMI_ID environment variable.',
      );
    }

    const tags: Tag[] = [
      { Key: 'ownerUsername', Value: ownerUsername },
      { Key: 'app', Value: 'vm-demo' },
      { Key: 'Name', Value: vmName },
    ];

    try {
      const command = new RunInstancesCommand({
        ImageId: amiId,
        MinCount: minCount,
        MaxCount: maxCount,
        InstanceType: instanceType as _InstanceType,
        TagSpecifications: [
          {
            ResourceType: 'instance',
            Tags: tags,
          },
        ],
        ...(securityGroupId && { SecurityGroupIds: [securityGroupId] }),
        ...(subnetId && { SubnetId: subnetId }),
      });

      const response = await client.send(command);

      if (!response.Instances || response.Instances.length === 0) {
        throw new Error('No instances created');
      }

      const instance = response.Instances[0];
      const instanceId = instance.InstanceId!;
      const state = instance.State?.Name || 'pending';

      console.log(
        `Created EC2 instance ${instanceId} in region ${targetRegion} for user ${ownerUsername}`,
      );

      return {
        instanceId,
        state,
        publicIp: instance.PublicIpAddress,
        privateIp: instance.PrivateIpAddress,
        instanceType: instance.InstanceType || instanceType,
        launchTime: instance.LaunchTime,
      };
    } catch (error) {
      console.error(
        `Failed to create EC2 instance: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  /**
   * Describes a single EC2 instance
   * @param instanceId The EC2 instance ID
   * @param region Optional region override
   * @returns Instance information or null if not found
   */
  async describeInstance(
    instanceId: string,
    region?: string,
  ): Promise<InstanceInfoDto | null> {
    const client = this.getClient(region);

    try {
      const command = new DescribeInstancesCommand({
        InstanceIds: [instanceId],
      });

      const response = await client.send(command);

      if (
        !response.Reservations ||
        response.Reservations.length === 0 ||
        !response.Reservations[0].Instances ||
        response.Reservations[0].Instances.length === 0
      ) {
        return null;
      }

      const instance = response.Reservations[0].Instances[0];

      return {
        instanceId: instance.InstanceId!,
        state: instance.State?.Name || 'unknown',
        publicIp: instance.PublicIpAddress,
        privateIp: instance.PrivateIpAddress,
        instanceType: instance.InstanceType || 'unknown',
        launchTime: instance.LaunchTime,
      };
    } catch (error) {
      console.error(
        `Failed to describe EC2 instance ${instanceId}: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  }

  /**
   * Describes multiple EC2 instances
   * @param instanceIds Array of EC2 instance IDs
   * @param region Optional region override
   * @returns Array of instance information
   */
  async describeInstances(
    instanceIds: string[],
    region?: string,
  ): Promise<InstanceInfoDto[]> {
    if (instanceIds.length === 0) {
      return [];
    }

    const client = this.getClient(region);

    try {
      const command = new DescribeInstancesCommand({
        InstanceIds: instanceIds,
      });

      const response = await client.send(command);

      const instances: InstanceInfoDto[] = [];

      if (response.Reservations) {
        for (const reservation of response.Reservations) {
          if (reservation.Instances) {
            for (const instance of reservation.Instances) {
              instances.push({
                instanceId: instance.InstanceId!,
                state: instance.State?.Name || 'unknown',
                publicIp: instance.PublicIpAddress,
                privateIp: instance.PrivateIpAddress,
                instanceType: instance.InstanceType || 'unknown',
                launchTime: instance.LaunchTime,
              });
            }
          }
        }
      }

      return instances;
    } catch (error) {
      console.error(
        `Failed to describe EC2 instances: ${error instanceof Error ? error.message : String(error)}`,
      );
      return [];
    }
  }

  /**
   * Terminates one or more EC2 instances
   * @param instanceIds Array of EC2 instance IDs to terminate
   * @param region Optional region override
   * @returns Array of terminated instance IDs
   */
  async terminateInstances(
    instanceIds: string[],
    region?: string,
  ): Promise<string[]> {
    if (instanceIds.length === 0) {
      return [];
    }

    const client = this.getClient(region);
    const targetRegion =
      region || this.configService.get<string>('ec.region') || 'us-east-1';

    try {
      const command = new TerminateInstancesCommand({
        InstanceIds: instanceIds,
      });

      const response = await client.send(command);

      const terminatedIds: string[] = [];

      if (response.TerminatingInstances) {
        for (const instance of response.TerminatingInstances) {
          if (instance.InstanceId) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            terminatedIds.push(instance.InstanceId);
            console.log(
              `Terminated EC2 instance ${instance.InstanceId} in region ${targetRegion}`,
            );
          }
        }
      }

      return terminatedIds;
    } catch (error) {
      console.error(
        `Failed to terminate EC2 instances: ${error instanceof Error ? error.message : String(error)}`,
      );
      throw error;
    }
  }

  /**
   * Terminates a single EC2 instance (convenience method)
   * @param instanceId The EC2 instance ID to terminate
   * @param region Optional region override
   */
  async terminateInstance(instanceId: string, region?: string): Promise<void> {
    await this.terminateInstances([instanceId], region);
  }
}
