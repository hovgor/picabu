import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntityBase } from './entity/users.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserValidator } from 'src/shared/validators/user.validator';
import { HashPassword } from 'src/shared/password-hash/hash.password';
import { ReactionsEntityBase } from './entity/reactions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntityBase, ReactionsEntityBase]),
    forwardRef(() => AuthModule),
  ],
  providers: [UsersService, UserValidator, HashPassword],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
