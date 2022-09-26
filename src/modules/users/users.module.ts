import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntityBase } from './entity/users.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserValidator } from 'src/shared/validators/user.validator';
import { HashPassword } from 'src/shared/password-hash/hash.password';
import { ReactionsEntityBase } from './entity/reactions.entity';
import { CommentsEntityBase } from './entity/comments.entity';
import { CommentsReactionsEntityBase } from './entity/comments.reactions.entity';
import { SubscribeGroupEntityBase } from './entity/subscribe.group.entity';
import { GroupsModule } from '../groups/groups.module';
import { SettingsService } from './settings/settings.service';
import { settingsController } from './settings/settings.controller';
import { ProvidersService } from 'src/auth/passwordLess/providers.service';
import { ProvidersController } from 'src/auth/passwordLess/providers.controller';
import { UserFollowEntitiyBase } from './entity/user.following.entity';
import { PostsEntityBase } from '../posts/entity/posts.entity';
import { BlockedEntityBase } from './entity/blocked.entity';
import { ProfileService } from './profile/profile.service';
import { ProfileController } from './profile/profile.controller';
import { NotificationService } from './notification/notification.service';
import { NotificationController } from './notification/notification.controller';
import { NotificationEntityBase } from './notification/entity/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntityBase,
      ReactionsEntityBase,
      CommentsEntityBase,
      ReactionsEntityBase,
      CommentsReactionsEntityBase,
      SubscribeGroupEntityBase,
      UserFollowEntitiyBase,
      PostsEntityBase,
      BlockedEntityBase,
      NotificationEntityBase,
    ]),
    forwardRef(() => AuthModule),
    GroupsModule,
  ],
  providers: [
    UsersService,
    UserValidator,
    HashPassword,
    ProvidersService,
    SettingsService,
    ProfileService,
    NotificationService,
  ],
  controllers: [
    UsersController,
    settingsController,
    ProvidersController,
    ProfileController,
    NotificationController,
  ],
  exports: [UsersService, SettingsService, ProvidersService, ProfileService],
})
export class UsersModule {}
