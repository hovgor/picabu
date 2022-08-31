import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { FavoritsEntityBase } from '../posts/entity/favorite.post.entity';
import { PostsEntityBase } from '../posts/entity/posts.entity';
import { CategoriesForFavoriteController } from './categories_for_favorite.controller';
import { CategoriesForFavoriteService } from './categories_for_favorite.service';
import { CategorieForFavoritsEntityBase } from './entity/categorie.for.favorits.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CategorieForFavoritsEntityBase,
      FavoritsEntityBase,
      PostsEntityBase,
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [CategoriesForFavoriteController],
  providers: [CategoriesForFavoriteService],
  exports: [CategoriesForFavoriteService],
})
export class CategoriesForFavoriteModule {}
