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
import { TegsService } from './tegs/tegs.service';
import { TagsEntityBase } from './tegs/entity/tags.entity';
import { CategoriesForFavoriteModule } from '../categories_for_favorite/categories_for_favorite.module';
import { FavoritsEntityBase } from './entity/favorite.post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PostsEntityBase,
      UploadFileEntityBase,
      TagsEntityBase,
      FavoritsEntityBase,
    ]),
    UsersModule,
    AuthModule,
    forwardRef(() => CategoriesForFavoriteModule),
  ],
  controllers: [PostsController],
  providers: [PostsService, UploadFileService, TegsService],
  exports: [PostsService],
})
export class PostsModule {}
