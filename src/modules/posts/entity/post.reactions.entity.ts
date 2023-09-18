import { UsersEntityBase } from 'src/modules/users/entity/users.entity';
import { PostsEntityBase } from './posts.entity';
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

@Entity({ schema: 'public', name: 'user_post_reactions' })
@Index(['user', 'post'], { unique: true })
export class PostReactionEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntityBase)
  @JoinColumn({ name: 'user_id' })
  user: number;

  @ManyToOne(() => PostsEntityBase)
  @JoinColumn({ name: 'post_id' })
  post: number;

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
