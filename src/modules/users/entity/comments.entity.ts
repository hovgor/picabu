import { AuthEntityBase } from 'src/auth/entity/auth.entity';
import { PostsEntityBase } from '../../posts/entity/posts.entity';
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
} from 'typeorm';
import { UsersEntityBase } from './users.entity';

@Entity({ schema: 'default', name: 'posts_comments' })
export class CommentsEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  user_id: number;

  @Column({ nullable: false })
  post_id: number;

  @Column({ nullable: false })
  comment: string;

  @Column({ nullable: true })
  parent_comment_id: number;

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
  postEntity: AuthEntityBase[];

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