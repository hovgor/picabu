import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntityBase } from './entity/users.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserValidator } from 'src/shared/validators/user.validator';
import { HashPassword } from 'src/shared/password-hash/hash.password';
import { PostReactionEntityBase } from '../posts/entity/post.reactions.entity';
import { CommentsEntityBase } from './entity/comments.entity';
import { CommentsReactionsEntityBase } from './entity/comments.reactions.entity';
import { SubscribeGroupEntityBase } from './entity/subscribe.group.entity';
import { GroupsModule } from '../groups/groups.module';
import { SettingsService } from './settings/SettingsService';
import { settingsController } from './settings/settings.controller';
import { ProvidersService } from 'src/auth/passwordLess/providers.service';
import { ProvidersController } from 'src/auth/passwordLess/providers.controller';
import { UserFollowEntitiyBase } from './entity/user.following.entity';
import { PostsEntityBase } from '../posts/entity/posts.entity';
import { BlockedEntityBase } from './entity/blocked.entity';
import { ProfileService } from './profile/profile.service';
import { ProfileController } from './profile/profile.controller';
import { UserFollowRequestEntitiyBase } from './entity/follow.request.entity';
import { GroupsEntityBase } from '../groups/entity/groups.entity';
import { ReportEntityBase } from './entity/report.entity';
import { DontRecommendEntityBase } from './entity/dont.recommend.entity';
import { helpEntityBase } from './entity/help.entity';
import { questionsEntityBase } from './entity/questions.entity';
import { PostReactionCountEntityBase } from '../posts/entity/posts.reactions.count.entity';
import { Utils } from 'src/shared/utils/utils';
import { RateCommentEntityBase } from './entity/comments.rate.entity';
import { RatePostEntityBase } from './entity/posts.rate.entity';
import { FavoritsEntityBase } from '../posts/entity/favorite.post.entity';
import { UserJoinedCommunitiesEntityBase } from '../groups/entity/userJoinedGroups.entity';
import { AdminsForComunityEntityBase } from '../groups/entity/admins.entity';
import { TagsPostEntityBase } from '../tags/entity/tags.for.posts.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserJoinedCommunitiesEntityBase,
      FavoritsEntityBase,
      UsersEntityBase,
      CommentsEntityBase,
      PostReactionEntityBase,
      CommentsReactionsEntityBase,
      SubscribeGroupEntityBase,
      UserFollowEntitiyBase,
      PostsEntityBase,
      BlockedEntityBase,
      UserFollowRequestEntitiyBase,
      GroupsEntityBase,
      ReportEntityBase,
      DontRecommendEntityBase,
      helpEntityBase,
      questionsEntityBase,
      PostReactionCountEntityBase,
      RateCommentEntityBase,
      RatePostEntityBase,
      AdminsForComunityEntityBase,
      TagsPostEntityBase,
    ]),
    forwardRef(() => AuthModule),
    GroupsModule,
    NotificationsModule,
  ],
  providers: [
    UsersService,
    UserValidator,
    HashPassword,
    ProvidersService,
    SettingsService,
    ProfileService,
    Utils,
  ],
  controllers: [
    UsersController,
    settingsController,
    ProvidersController,
    ProfileController,
  ],
  exports: [UsersService, SettingsService, ProvidersService, ProfileService],
})
export class UsersModule {}
