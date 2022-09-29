import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseConfigService } from './config/config.service.database';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { CategoriesForFavoriteModule } from './modules/categories_for_favorite/categories_for_favorite.module';
import { GroupsModule } from './modules/groups/groups.module';
import { GatewaysModule } from './shared/gateways/gateways.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    PostsModule,
    CategoriesForFavoriteModule,
    GroupsModule,
    GatewaysModule,
  ],
  providers: [DatabaseConfigService],
})
export class AppModule {}
