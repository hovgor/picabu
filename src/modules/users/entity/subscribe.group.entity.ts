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

@Entity({ schema: 'default', name: 'Subscribe_group' })
export class SubscribeGroupEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntityBase, (user) => user.userEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  // @Column({ nullable: true, name: 'user_id' })
  userId: number;

  @ManyToOne(() => GroupsEntityBase, (group) => group.groupEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  // @Column({ nullable: true, name: 'group_id' })
  groupId: number;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  // @UpdateDateColumn({
  //   name: 'updated_date',
  //   type: 'timestamp',
  //   default: () => 'CURRENT_TIMESTAMP(6)',
  //   onUpdate: 'CURRENT_TIMESTAMP(6)',
  // })
  // public updatedAt: Date;
}
