import { GroupsEntityBase } from 'src/modules/groups/entity/groups.entity';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TagsNameEntityBase } from './tags.name.entity';

@Entity({ schema: 'public', name: 'tags_group' })
export class TagsGroupEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TagsNameEntityBase, (tagEntity) => tagEntity.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  tag: number;

  @ManyToOne(() => GroupsEntityBase, (groupEntity) => groupEntity.groupEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  group: number;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;
}
