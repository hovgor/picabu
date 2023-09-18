import { PostsEntityBase } from '../../posts/entity/posts.entity';
import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntityBase } from './users.entity';

@Entity({ schema: 'public', name: 'post_rates' })
@Unique(['user', 'post'])
export class RatePostEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntityBase, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: number;

  @ManyToOne(() => PostsEntityBase, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: number;

  @Column({ name: 'rated', default: 0, nullable: true })
  rated: number;

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

  @BeforeInsert()
  @BeforeUpdate()
  validateRatedValue() {
    if (this.rated < -1 || this.rated > 1) {
      throw new Error(
        'Invalid rated value. Rated value must be between -1 and 1.',
      );
    }
  }
}
