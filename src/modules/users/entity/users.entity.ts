import { AuthEntityBase } from 'src/auth/entity/auth.entity';
import { GroupsEntityBase } from 'src/modules/groups/entity/groups.entity';
import { PostsEntityBase } from 'src/modules/posts/entity/posts.entity';
import { ReactionIconsEntityBase } from 'src/modules/posts/reaction-icons/entity/reaction.icons.entity';
import { UserRoles } from 'src/shared/types/roles';
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
import { SubscribeGroupEntityBase } from './subscribe.group.entity';
import { BlockedEntityBase } from './blocked.entity';
import { CommentsEntityBase } from './comments.entity';
import { PostReactionEntityBase } from 'src/modules/posts/entity/post.reactions.entity';
import { CommentsReactionsEntityBase } from './comments.reactions.entity';
import { UserFollowEntitiyBase } from './user.following.entity';
import { AdminsForComunityEntityBase } from 'src/modules/groups/entity/admins.entity';

@Entity({ schema: 'public', name: 'users' })
export class UsersEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null, nullable: true, unique: true })
  email: string;

  @Column({ default: null, nullable: true })
  phone: string;

  @Column({ default: 0, nullable: true })
  rating: number;

  @Column({ default: null, nullable: true })
  password: string;

  @Index('nickname')
  @Column({ default: null, nullable: true, unique: true })
  nickname: string;

  @Column({ default: null, nullable: true, name: 'profile_photo_url' })
  profilePhotoUrl: string;

  @Column({ default: null, nullable: true, name: 'background_photo_url' })
  backgroundPhotoUrl: string;

  @Column({ default: 'local', nullable: false })
  provider: string;

  @Column({ default: null, nullable: true, name: 'provider_id' })
  providerId: string;

  @Column({ default: null, nullable: true, name: 'user_type' })
  userType: string;

  @Column({ name: 'device_id', default: null, nullable: true })
  deviceId: string;

  @Column({ default: null, nullable: true })
  role: UserRoles;

  @Column({ default: false, nullable: false })
  privacy: boolean;

  @OneToMany(() => BlockedEntityBase, (blocked) => blocked.blockedUser, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  blockedEntity: BlockedEntityBase[];

  @OneToMany(() => AuthEntityBase, (auth) => auth.user, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  authEntity: AuthEntityBase[];

  @OneToMany(() => PostsEntityBase, (post) => post.user, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  postEntity: PostsEntityBase[];

  @OneToMany(() => SubscribeGroupEntityBase, (user) => user.user, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  userEntity: SubscribeGroupEntityBase[];

  @OneToMany(
    () => ReactionIconsEntityBase,
    (reactionIcons) => reactionIcons.userId,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  @JoinTable()
  reactionIconsEntity: ReactionIconsEntityBase[];

  @OneToMany(() => GroupsEntityBase, (group) => group.user, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  groupeEntity: GroupsEntityBase[];

  @OneToMany(() => AdminsForComunityEntityBase, (admins) => admins.user, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  adminsEntity: AdminsForComunityEntityBase[];

  @OneToMany(() => CommentsEntityBase, (comment) => comment.user, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  commentsEntity: CommentsEntityBase[];

  @OneToMany(
    () => CommentsReactionsEntityBase,
    (commentReaction) => commentReaction.user,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  @JoinTable()
  commentsReactionEntity: CommentsReactionsEntityBase[];

  @OneToMany(() => PostReactionEntityBase, (reaction) => reaction.user, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  reactionsEntity: PostReactionEntityBase[];

  @ManyToOne(() => UserFollowEntitiyBase)
  @JoinColumn({ name: 'follow_id' })
  followId: number;

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
