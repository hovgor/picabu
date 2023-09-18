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

@Entity({ schema: 'public', name: 'comment_reactions' })
@Unique(['user', 'comment'])
export class CommentsReactionsEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntityBase, (user) => user.commentsReactionEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: number;

  @ManyToOne(() => CommentsEntityBase, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: number;

  @Column({ nullable: false, name: 'reaction_id' })
  reaction: number;

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
