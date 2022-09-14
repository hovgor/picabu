import { PostsEntityBase } from 'src/modules/posts/entity/posts.entity';
import { TagsGroupEntityBase } from 'src/modules/tags/entity/tags.for.group.entity';
import { SubscribeGroupEntityBase } from 'src/modules/users/entity/subscribe.group.entity';
import { UsersEntityBase } from 'src/modules/users/entity/users.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'default', name: 'Groups' })
export class GroupsEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null, nullable: true })
  title: string;

  @ManyToOne(() => UsersEntityBase, (user) => user.groupeEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Index()
  @Column()
  user: number;

  @OneToMany(() => SubscribeGroupEntityBase, (group) => group.groupId, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  groupEntity: SubscribeGroupEntityBase[];

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

  @OneToMany(() => PostsEntityBase, (post) => post.groupId, {
    onDelete: 'CASCADE',
    nullable: true,
  })
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
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
