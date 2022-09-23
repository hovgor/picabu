import { PostsEntityBase } from '../../posts/entity/posts.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { UsersEntityBase } from './users.entity';
import { CommentsEntityBase } from './comments.entity';

@Entity({ schema: 'default', name: 'User_comment_reactions' })
@Unique(['userId', 'commentId'])
export class CommentsReactionsEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntityBase, (user) => user.commentsReactionEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Column({ nullable: true, name: 'user_id' })
  userId: number;

  @ManyToOne(() => CommentsEntityBase, (user) => user.commentsEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Column({ nullable: true, name: 'comment_id' })
  commentId: number;

  @Column({ nullable: false })
  reactionType: number;

  @ManyToOne(() => PostsEntityBase, (post) => post.commentsReactionEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Column({ nullable: true, name: 'post_id' })
  postId: number;

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
