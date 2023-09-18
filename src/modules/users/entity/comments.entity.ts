import { PostsEntityBase } from '../../posts/entity/posts.entity';
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
import { UsersEntityBase } from './users.entity';

@Entity({ schema: 'public', name: 'posts_comments' })
export class CommentsEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  comment: string;

  @Column({ default: 0, nullable: true })
  rating: number;

  @ManyToOne(() => CommentsEntityBase, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_comment_id' })
  parentCommentId: number | null;

  @ManyToOne(() => UsersEntityBase, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: number;

  @ManyToOne(() => PostsEntityBase, (post) => post.id, {
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

  @UpdateDateColumn({
    name: 'updated_date',
    type: 'timestamp',
    default: null,
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
