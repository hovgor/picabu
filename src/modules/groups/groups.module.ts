import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { GroupsEntityBase } from './entity/groups.entity';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { TagsService } from '../tags/tags.service';
import { TagsModule } from '../tags/tags.module';
import { TagsPostEntityBase } from '../tags/entity/tags.for.posts.entity';
import { TagsNameEntityBase } from '../tags/entity/tags.name.entity';
import { TagsGroupEntityBase } from '../tags/entity/tags.for.group.entity';
import { SubscribeGroupEntityBase } from '../users/entity/subscribe.group.entity';
import { PostsToGroupEntityBase } from '../posts/entity/group.post.entity';
import { AdminsForComunityEntityBase } from './entity/admins.entity';
import { UserJoinedCommunitiesEntityBase } from './entity/userJoinedGroups.entity';
import { Utils } from 'src/shared/utils/utils';
import { BlockedEntityBase } from '../users/entity/blocked.entity';
import { DontRecommendEntityBase } from '../users/entity/dont.recommend.entity';
import { UserFollowRequestEntitiyBase } from '../users/entity/follow.request.entity';
import { PostsEntityBase } from '../posts/entity/posts.entity';
import { FavoritsEntityBase } from '../posts/entity/favorite.post.entity';
import { PostReactionCountEntityBase } from '../posts/entity/posts.reactions.count.entity';
import { CommentsEntityBase } from '../users/entity/comments.entity';
import { RatePostEntityBase } from '../users/entity/posts.rate.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupsEntityBase,
      UserJoinedCommunitiesEntityBase,
      TagsPostEntityBase,
      TagsNameEntityBase,
      TagsGroupEntityBase,
      SubscribeGroupEntityBase,
      PostsToGroupEntityBase,
      AdminsForComunityEntityBase,
      BlockedEntityBase,
      DontRecommendEntityBase,
      UserFollowRequestEntitiyBase,
      PostsEntityBase,
      CommentsEntityBase,
      FavoritsEntityBase,
      PostReactionCountEntityBase,
      RatePostEntityBase,
    ]),
    forwardRef(() => TagsModule),
    AuthModule,
  ],
  controllers: [GroupsController],
  providers: [GroupsService, TagsService, Utils],
  exports: [GroupsService],
})
export class GroupsModule {}
