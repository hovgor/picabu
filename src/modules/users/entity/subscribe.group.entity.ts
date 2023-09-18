import { GroupsEntityBase } from 'src/modules/groups/entity/groups.entity';
import {
  BaseEntity,
  // Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  // UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UsersEntityBase } from './users.entity';

@Entity({ schema: 'public', name: 'subscribe_community' })
export class SubscribeGroupEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntityBase, (user) => user.userEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: number;

  @ManyToOne(() => GroupsEntityBase, (group) => group.groupEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'community_id' })
  community: number;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;
}
