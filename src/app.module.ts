import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { DatabaseConfigService } from './config/config.service.database';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { GroupsModule } from './modules/groups/groups.module';
import { GatewaysModule } from './shared/gateways/gateways.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { GlobalsModule } from './modules/globals/globals.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    PostsModule,
    GroupsModule,
    GatewaysModule,
    PaymentsModule,
    GlobalsModule,
    NotificationsModule,
    SearchModule,
  ],
  providers: [DatabaseConfigService],
})
export class AppModule { }
