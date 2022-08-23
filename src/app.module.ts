import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseConfigService } from './config/config.service.database';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';

@Module({
  imports: [ConfigModule, DatabaseModule, UsersModule, AuthModule, PostsModule],
  providers: [DatabaseConfigService],
})
export class AppModule {}
