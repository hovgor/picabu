import { AuthEntityBase } from 'src/auth/entity/auth.entity';
import { CategorieForFavoritsEntityBase } from 'src/modules/categories_for_favorite/entity/categorie.for.favorits.entity';
import { GroupsEntityBase } from 'src/modules/groups/entity/groups.entity';
import { PostsEntityBase } from 'src/modules/posts/entity/posts.entity';
import { ReactionIconsEntityBase } from 'src/modules/posts/reaction-icons/entity/reaction.icons.entity';
import { UserRoles } from 'src/shared/types/roles';
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
import { SubscribeGroupEntityBase } from './subscribe.group.entity';
import { BlockedEntityBase } from './blocked.entity';
import { CommentsEntityBase } from './comments.entity';
import { ReactionsEntityBase } from './reactions.entity';
import { CommentsReactionsEntityBase } from './comments.reactions.entity';
import { NotificationEntityBase } from '../notification/entity/notification.entity';

@Entity({ schema: 'default', name: 'Users' })
export class UsersEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null, nullable: true })
  email: string;

  @Column({ default: null, nullable: true })
  phone: string;

  @Column({ default: null, nullable: true })
  password: string;

  @Column({ default: null, nullable: true })
  nicname: string;

  @Column({ default: null, nullable: true })
  profilePhotoUrl: string;

  @Column({ default: 'local', nullable: false })
  provider: string;

  @Column({ default: null, nullable: true })
  providerId: number;

  @Column({ default: null, nullable: true })
  userType: string;

  @Column({ name: 'device_id', default: null, nullable: true })
  deviceId: string;

  @Column({ default: null, nullable: true })
  role: UserRoles;

  @OneToMany(() => BlockedEntityBase, (blocked) => blocked.blockedUser, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  blockedEntity: BlockedEntityBase[];

  @OneToMany(() => AuthEntityBase, (auth) => auth.userId, {
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

  @OneToMany(() => SubscribeGroupEntityBase, (user) => user.userId, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  userEntity: SubscribeGroupEntityBase[];

  @OneToMany(
    () => CategorieForFavoritsEntityBase,
    (categorie) => categorie.user,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  @JoinTable()
  categorieForFavoritesEntity: CategorieForFavoritsEntityBase[];

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

  @OneToMany(() => CommentsEntityBase, (comment) => comment.userId, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  commentsEntity: CommentsEntityBase[];

  @OneToMany(
    () => CommentsReactionsEntityBase,
    (commentReaction) => commentReaction.userId,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  @JoinTable()
  commentsReactionEntity: CommentsReactionsEntityBase[];

  @OneToMany(() => ReactionsEntityBase, (reaction) => reaction.userId, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  reactionsEntity: ReactionsEntityBase[];

  @OneToMany(() => NotificationEntityBase, (reaction) => reaction.userId, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  notificationEntity: NotificationEntityBase[];

  // @ManyToOne(() => NotificationEntityBase, (user) => user.followUserEntity, {
  //   onDelete: 'CASCADE',
  // })
  // @JoinColumn()
  // @Column({ nullable: true, name: 'follow_user_id' })
  // followUserId: number;

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
