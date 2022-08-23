import { UsersEntityBase } from 'src/users/entity/users.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'default', name: 'Auth' })
export class AuthEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // @Column({ name: 'device_id' })
  // deviceId: string;

  @Column({ default: null, nullable: true, name: 'access_token' })
  accessToken: string;

  @Column({ default: null, nullable: true, name: 'refresh_token' })
  refreshToken: string;

  @Column({ default: null, nullable: true, name: 'device_id' })
  deviceId: string;

  @ManyToOne(() => UsersEntityBase, (user) => user.authEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Column({ name: 'user_id' })
  userId: number;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
