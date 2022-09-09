import { GroupsEntityBase } from 'src/modules/groups/entity/groups.entity';
import { UsersEntityBase } from 'src/modules/users/entity/users.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TagsEntityBase } from '../tegs/entity/tags.entity';
import { UploadFileEntityBase } from '../upload_file/entity/upload_file.entity';
import { FavoritsEntityBase } from './favorite.post.entity';

@Entity({ schema: 'default', name: 'Posts' })
export class PostsEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null, nullable: true })
  title: string;

  @Column({ default: null, nullable: true })
  description: string;

  @Column({ default: null, nullable: true })
  attachment: string;

  @Column({ default: 0, nullable: false })
  rating: number;

  @ManyToOne(() => UsersEntityBase, (user) => user.postEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => GroupsEntityBase, (group) => group.postsEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Column({ name: 'group_id', nullable: true })
  groupId: number;

  @OneToMany(() => UploadFileEntityBase, (upload_file) => upload_file.postId, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  uploadFileEntity: UploadFileEntityBase[];

  @OneToMany(() => TagsEntityBase, (tag) => tag.postId, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  tagsEntity: TagsEntityBase[];

  @OneToMany(() => FavoritsEntityBase, (tag) => tag.postId, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  favoritesEntity: FavoritsEntityBase[];

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
