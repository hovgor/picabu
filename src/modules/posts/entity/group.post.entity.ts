import { GroupsEntityBase } from 'src/modules/groups/entity/groups.entity';
import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostsEntityBase } from './posts.entity';

@Entity({ schema: 'public', name: 'posts_to_groups' })
export class PostsToGroupEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PostsEntityBase, (post) => post.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  postId: number;

  @ManyToOne(
    () => GroupsEntityBase,
    (categories) => categories.postToGroupEntity,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'group_id' })
  groupId: number;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;
}
