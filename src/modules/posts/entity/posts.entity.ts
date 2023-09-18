import { GroupsEntityBase } from 'src/modules/groups/entity/groups.entity';
import { UsersEntityBase } from 'src/modules/users/entity/users.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UploadFileEntityBase } from '../upload_file/entity/upload_file.entity';
import { TagsPostEntityBase } from 'src/modules/tags/entity/tags.for.posts.entity';

@Entity({ schema: 'public', name: 'posts' })
export class PostsEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null, nullable: true })
  title: string;

  @Column('text', { array: true, default: null, nullable: true })
  description: string[];

  @OneToMany(() => UploadFileEntityBase, (uploadFile) => uploadFile.postId, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @Column({ default: null, name: 'file_url', nullable: true })
  fileUrl: string;

  @OneToMany(() => TagsPostEntityBase, (tags) => tags.post, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  // @Column({ default: null, name: 'tags_entity', nullable: true })
  tagsEntity: string;

  @Column({ default: 0, nullable: true })
  rating: number;

  @Column({ default: 0, name: 'comments_count', nullable: false })
  commentsCount: number;

  @ManyToOne(() => UsersEntityBase)
  @JoinColumn({ name: 'user_id' })
  user: number;

  @ManyToOne(() => GroupsEntityBase)
  @JoinColumn({ name: 'community_id' })
  community: number;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;
}
