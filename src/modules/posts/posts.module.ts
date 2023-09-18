import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/modules/users/users.module';
import { PostsEntityBase } from './entity/posts.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { UploadFileEntityBase } from './upload_file/entity/upload_file.entity';
import { UploadFileService } from './upload_file/upload_file.service';
import { TagsService } from '../tags/tags.service';
import { FavoritsEntityBase } from './entity/favorite.post.entity';
import { ReactionIconsService } from './reaction-icons/reaction-icons.service';
import { ReactionIconsEntityBase } from './reaction-icons/entity/reaction.icons.entity';
import { PostValidator } from 'src/shared/validators/post.validator';
import { TagsModule } from '../tags/tags.module';
import { TagsNameEntityBase } from '../tags/entity/tags.name.entity';
import { TagsPostEntityBase } from '../tags/entity/tags.for.posts.entity';
import { TagsGroupEntityBase } from '../tags/entity/tags.for.group.entity';
import { GroupsEntityBase } from '../groups/entity/groups.entity';
import { PostsToGroupEntityBase } from './entity/group.post.entity';
import { PostReactionEntityBase } from './entity/post.reactions.entity';
import { CommentsEntityBase } from '../users/entity/comments.entity';
import { PostReactionCountEntityBase } from './entity/posts.reactions.count.entity';
import { RatePostEntityBase } from '../users/entity/posts.rate.entity';
import { RateCommentEntityBase } from '../users/entity/comments.rate.entity';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsEntityBase,
      RatePostEntityBase,
      PostReactionEntityBase,
      UploadFileEntityBase,
      FavoritsEntityBase,
      ReactionIconsEntityBase,
      TagsNameEntityBase,
      TagsPostEntityBase,
      TagsGroupEntityBase,
      GroupsEntityBase,
      PostsToGroupEntityBase,
      CommentsEntityBase,
      PostReactionCountEntityBase,
      RateCommentEntityBase,
    ]),
    UsersModule,
    AuthModule,
    TagsModule,
    NotificationsModule,
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    UploadFileService,
    TagsService,
    ReactionIconsService,
    PostValidator,
  ],
  exports: [PostsService, TagsService],
})
export class PostsModule {}
