import { AuthEntityBase } from 'src/auth/entity/auth.entity';
import { PostsEntityBase } from '../../posts/entity/posts.entity';
// import { PostsEntityBase } from 'src/posts/entity/posts.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Unique,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { UsersEntityBase } from './users.entity';

@Entity({ schema: 'default', name: 'User_posts_reactions' })
@Unique(['userId', 'postId'])
export class ReactionsEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntityBase, (reactions) => reactions.reactionsEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => PostsEntityBase, (reactions) => reactions.reactionsEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Column({ name: 'post_id' })
  postId: number;

  @Column({ nullable: false })
  reactionType: number;

  @OneToMany(() => UsersEntityBase, (users) => users.id, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  authEntity: AuthEntityBase[];

  @OneToMany(() => PostsEntityBase, (post) => post.userId, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  postEntity: PostsEntityBase[];

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
