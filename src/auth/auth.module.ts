import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashPassword } from 'src/shared/password-hash/hash.password';
import { UserValidator } from 'src/shared/validators/user.validator';
import { UsersEntityBase } from 'src/users/entity/users.entity';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants/jwt.constants';
import { AuthEntityBase } from './entity/auth.entity';
import { PasswordController } from './password/password.controller';
import { PasswordService } from './password/password.service';
import { ProvidersController } from './passwordLess/providers.controller';
import { ProvidersService } from './passwordLess/providers.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresInAccessToken },
    }),
    TypeOrmModule.forFeature([AuthEntityBase, UsersEntityBase]),
  ],
  controllers: [AuthController, PasswordController, ProvidersController],
  providers: [
    AuthService,
    UserValidator,
    HashPassword,
    PasswordService,
    ProvidersService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
