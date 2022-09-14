import { GroupsEntityBase } from 'src/modules/groups/entity/groups.entity';
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
import { TagsNameEntityBase } from './tags.name.entity';

@Entity({ schema: 'default', name: 'Tags_Group' })
export class TagsGroupEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TagsNameEntityBase, (tagEntity) => tagEntity.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Column({ name: 'tag_id' })
  tag: number;

  @ManyToOne(() => GroupsEntityBase, (groupEntity) => groupEntity.groupEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Column({ name: 'group_id' })
  group: number;

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
