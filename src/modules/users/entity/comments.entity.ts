import { PostsEntityBase } from '../../posts/entity/posts.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntityBase } from './users.entity';
import { CommentsReactionsEntityBase } from './comments.reactions.entity';
import { NotificationEntityBase } from '../notification/entity/notification.entity';

@Entity({ schema: 'default', name: 'Posts_comments' })
export class CommentsEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntityBase, (comment) => comment.commentsEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  // @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => PostsEntityBase, (comment) => comment.commentsEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  // @Column({ name: 'post_id' })
  postId: number;

  @OneToMany(
    () => CommentsReactionsEntityBase,
    (commentReaction) => commentReaction.userId,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  @JoinTable()
  commentsEntity: CommentsReactionsEntityBase[];

  @OneToMany(
    () => NotificationEntityBase,
    (commentReaction) => commentReaction.commentId,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  @JoinTable()
  notificationEntity: NotificationEntityBase[];

  @Column({ nullable: false })
  comment: string;

  @Column({ default: 0, nullable: true })
  rating: number;

  @Column({ nullable: true, default: 0 })
  parentCommentId: number;

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
