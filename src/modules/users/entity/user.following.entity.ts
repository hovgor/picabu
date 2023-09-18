import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { UsersEntityBase } from './users.entity';

@Entity({ schema: 'public', name: 'user_following' })
@Unique(['user', 'followTo'])
export class UserFollowEntitiyBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntityBase)
  @JoinColumn({ name: 'user_id' })
  user: number;

  @ManyToOne(() => UsersEntityBase)
  @JoinColumn({ name: 'follow_to_id' })
  followTo: number;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_date',
    type: 'timestamp',
    default: null,
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
