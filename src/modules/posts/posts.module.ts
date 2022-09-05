import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
// import { AuthService } from 'src/auth/auth.service';
import { UsersModule } from 'src/modules/users/users.module';
// import { UsersService } from 'src/users/users.service';
import { PostsEntityBase } from './entity/posts.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { UploadFileEntityBase } from './upload_file/entity/upload_file.entity';
import { UploadFileService } from './upload_file/upload_file.service';
import { TagsService } from './tags/tags.service';
import { TagsEntityBase } from './tags/entity/tags.entity';
import { CategoriesForFavoriteModule } from '../categories_for_favorite/categories_for_favorite.module';
import { FavoritsEntityBase } from './entity/favorite.post.entity';
import { ReactionIconsService } from './reaction-icons/reaction-icons.service';
import { ReactionIconsEntityBase } from './reaction-icons/entity/reaction.icons.entity';
import { PostValidator } from 'src/shared/validators/post.validator';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsEntityBase,
      UploadFileEntityBase,
      TagsEntityBase,
      FavoritsEntityBase,
      ReactionIconsEntityBase,
    ]),
    UsersModule,
    AuthModule,
    forwardRef(() => CategoriesForFavoriteModule),
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
