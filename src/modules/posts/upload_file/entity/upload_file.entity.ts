import { PostsEntityBase } from 'src/modules/posts/entity/posts.entity';
import { UsersEntityBase } from 'src/modules/users/entity/users.entity';
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

@Entity({ schema: 'default', name: 'Upload_file' })
export class UploadFileEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null, nullable: true })
  path: string;

  @ManyToOne(() => PostsEntityBase, (postEntity) => postEntity.attachment, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Column({ name: 'post_id' })
  postId: number;

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
