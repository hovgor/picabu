import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTokensEntityBase } from './entity/notificationTokens.entity';
import { NotificationMainService } from './notifications.config';
import { NotificationsEntityBase } from './entity/notifications.entity';
import { UsersEntityBase } from 'src/modules/users/entity/users.entity';
import { Utils } from 'src/shared/utils/utils';
import { GroupsModule } from 'src/modules/groups/groups.module';
import { AdminsForComunityEntityBase } from 'src/modules/groups/entity/admins.entity';
import { BlockedEntityBase } from 'src/modules/users/entity/blocked.entity';
import { DontRecommendEntityBase } from 'src/modules/users/entity/dont.recommend.entity';
import { GroupsEntityBase } from 'src/modules/groups/entity/groups.entity';
import { PostsEntityBase } from 'src/modules/posts/entity/posts.entity';
import { PostReactionEntityBase } from 'src/modules/posts/entity/post.reactions.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserFollowRequestEntitiyBase } from 'src/modules/users/entity/follow.request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NotificationTokensEntityBase,
      NotificationsEntityBase,
      UsersEntityBase,
      GroupsEntityBase,
      AdminsForComunityEntityBase,
      BlockedEntityBase,
      DontRecommendEntityBase,
      PostsEntityBase,
      PostReactionEntityBase,
      UserFollowRequestEntitiyBase,
    ]),
    GroupsModule,
    AuthModule,
  ],
  providers: [NotificationsService, NotificationMainService, Utils],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
