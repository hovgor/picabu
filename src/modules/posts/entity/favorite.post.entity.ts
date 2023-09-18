import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostsEntityBase } from './posts.entity';
import { UsersEntityBase } from 'src/modules/users/entity/users.entity';

@Entity({ schema: 'public', name: 'favorite_posts' })
@Index(['post', 'user'], { unique: true })
export class FavoritsEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PostsEntityBase, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: number;

  @ManyToOne(() => UsersEntityBase, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: number;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;
}
