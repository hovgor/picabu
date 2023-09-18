import { PostsEntityBase } from './posts.entity';
import { PostReactions } from 'src/shared/types/reactions';
import {
  BaseEntity,
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'public', name: 'posts_reactions_count' })
@Index(['post', 'reaction'], { unique: true })
export class PostReactionCountEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PostsEntityBase)
  @JoinColumn({ name: 'post_id' })
  post: number;

  @Column({ nullable: false, name: 'reaction' })
  reaction: PostReactions;

  @Column({ nullable: false, name: 'count' })
  @Check(`"count" >= 0`)
  count: number;

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
