import { PostsEntityBase } from 'src/modules/posts/entity/posts.entity';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TagsNameEntityBase } from './tags.name.entity';

@Entity({ schema: 'public', name: 'tags_post' })
export class TagsPostEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TagsNameEntityBase, (tagEntity) => tagEntity.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'tag_id' })
  tag: number;

  @ManyToOne(() => PostsEntityBase, (postEntity) => postEntity.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: number;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;
}
