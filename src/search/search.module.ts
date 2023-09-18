import { Module, forwardRef } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { UsersEntityBase } from 'src/modules/users/entity/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsEntityBase } from 'src/modules/posts/entity/posts.entity';
import { GroupsEntityBase } from 'src/modules/groups/entity/groups.entity';
import { UserFollowEntitiyBase } from 'src/modules/users/entity/user.following.entity';
import { UserFollowRequestEntitiyBase } from 'src/modules/users/entity/follow.request.entity';
import { AuthModule } from 'src/auth/auth.module';
import { PostReactionCountEntityBase } from 'src/modules/posts/entity/posts.reactions.count.entity';
import { CommentsEntityBase } from 'src/modules/users/entity/comments.entity';
import { RatePostEntityBase } from 'src/modules/users/entity/posts.rate.entity';
import { SubscribeGroupEntityBase } from 'src/modules/users/entity/subscribe.group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntityBase,
      PostsEntityBase,
      GroupsEntityBase,
      UserFollowEntitiyBase,
      UserFollowRequestEntitiyBase,
      PostReactionCountEntityBase,
      CommentsEntityBase,
      RatePostEntityBase,
      SubscribeGroupEntityBase,
    ]),
    forwardRef(() => AuthModule),
  ],
  providers: [SearchService],
  controllers: [SearchController],
})
export class SearchModule {}
