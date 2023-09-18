import { UsersEntityBase } from 'src/modules/users/entity/users.entity';
import { PostReactions } from 'src/shared/types/reactions';
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
import { PostsEntityBase } from '../../entity/posts.entity';

@Entity({ schema: 'public', name: 'reaction_icons' })
export class ReactionIconsEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PostsEntityBase, (post) => post.id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Column({ nullable: true, name: 'post_id' })
  postId: number;

  @ManyToOne(() => UsersEntityBase, (user) => user.reactionIconsEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Column({ nullable: true, name: 'user_id' })
  userId: number;

  @Column({ nullable: true, default: PostReactions.Default })
  reactionType: PostReactions;

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
