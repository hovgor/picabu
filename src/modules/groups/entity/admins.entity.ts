import { GroupsEntityBase } from 'src/modules/groups/entity/groups.entity';
import { UsersEntityBase } from 'src/modules/users/entity/users.entity';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'public', name: 'admins_for_comunity' })
export class AdminsForComunityEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GroupsEntityBase, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'group_id' })
  group: number;

  @ManyToOne(() => UsersEntityBase, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: number;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;
}
