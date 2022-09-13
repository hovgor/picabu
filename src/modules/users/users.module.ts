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
import { PostsEntityBase } from '../posts/entity/posts.entity';
import { BlockedEntityBase } from './entity/blocked.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntityBase,
      ReactionsEntityBase,
      CommentsEntityBase,
      ReactionsEntityBase,
      CommentsReactionsEntityBase,
      SubscribeGroupEntityBase,
      PostsEntityBase,
      BlockedEntityBase,
    ]),
    forwardRef(() => AuthModule),
    GroupsModule,
  ],
  providers: [UsersService, UserValidator, HashPassword],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
