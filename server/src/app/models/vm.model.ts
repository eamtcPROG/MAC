import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class VM {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  instanceId: string;

  @Column({ length: 32 })
  instanceType: string;

  @Column({ length: 64 })
  vmName: string;

  @Column({ length: 64 })
  ownerUsername: string;

  @Column({ length: 32 })
  region: string;

  @Column({ nullable: true })
  publicIp?: string;

  @Column({ nullable: true })
  privateIp?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
