import { PostsToGroupEntityBase } from 'src/modules/posts/entity/group.post.entity';
import { PostsEntityBase } from 'src/modules/posts/entity/posts.entity';
import { TagsGroupEntityBase } from 'src/modules/tags/entity/tags.for.group.entity';
import { SubscribeGroupEntityBase } from 'src/modules/users/entity/subscribe.group.entity';
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
import { AdminsForComunityEntityBase } from './admins.entity';

@Entity({ schema: 'public', name: 'communities' })
export class GroupsEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null, nullable: true })
  name: string;

  @Column({ default: null, nullable: true })
  description: string;

  @Column({ default: null, nullable: true, name: 'background_img_url' })
  backgroundImgUrl: string;

  @Column({ default: null, nullable: true, name: 'profile_img_url' })
  profileImgUrl: string;

  @Column({ default: false, nullable: true })
  privacy: boolean;

  @Column({ default: 0, nullable: false })
  posts_count: number;

  @Column({ default: 0, nullable: false })
  users_count: number;

  @ManyToOne(() => UsersEntityBase)
  @JoinColumn({ name: 'user_id' })
  user: number;

  @OneToMany(() => SubscribeGroupEntityBase, (group) => group.community, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  groupEntity: SubscribeGroupEntityBase[];

  @OneToMany(() => AdminsForComunityEntityBase, (admins) => admins.group, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  adminsEntity: AdminsForComunityEntityBase[];

  @OneToMany(() => PostsToGroupEntityBase, (group) => group.groupId, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  postToGroupEntity: PostsToGroupEntityBase[];

  @Column({ default: null, nullable: true, unique: true })
  url: string;

  @Column({ default: null, nullable: true })
  attachment: string;

  @OneToMany(() => TagsGroupEntityBase, (tag) => tag.group, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  tagsEntity: TagsGroupEntityBase[];

  @JoinTable()
  postsEntity: PostsEntityBase[];

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
  community: any;
}
