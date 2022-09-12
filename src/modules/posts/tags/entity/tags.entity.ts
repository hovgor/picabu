import { GroupsEntityBase } from 'src/modules/groups/entity/groups.entity';
import { PostsEntityBase } from 'src/modules/posts/entity/posts.entity';

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'default', name: 'Tags' })
export class TagsEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('name')
  @Column({ default: null, nullable: false, unique: true })
  name: string;

  @Column({ default: null, nullable: true })
  defaultId: number;

  @ManyToOne(() => PostsEntityBase, (postEntity) => postEntity.tagsEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Column({ name: 'post_id', nullable: true })
  postId: number;

  @ManyToOne(() => GroupsEntityBase, (groupEntity) => groupEntity.tagsEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Column({ name: 'group_id', nullable: true })
  groupId: number;

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
