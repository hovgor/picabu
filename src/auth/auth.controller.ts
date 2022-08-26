import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { EmailVerifyDto } from 'src/modules/users/dto/email.verify.dto';

import { UserSignInDto } from 'src/modules/users/dto/user.signin.dto';
import { UserSignUpDto } from 'src/modules/users/dto/user.signup.dto';
import { UsersService } from 'src/modules/users/users.service';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('signUp/confirm')
  async signUp(@Body() body: UserSignUpDto, @Res() res: Response) {
    try {
      const newUser = await this.authService.createNewUser(body);
      return res.status(HttpStatus.CREATED).json(newUser);
    } catch (error) {
      throw error;
    }
  }

  @Post('signUp/verify')
  async signUpVerify(@Body() body: EmailVerifyDto, @Res() res: Response) {
    try {
      const existEmail = await this.usersService.getUserWhitEmail(body.email);
      if (existEmail) {
        throw new UnprocessableEntityException(
          `User whit this email olredy exist!!!`,
        );
      }
      const sender = await this.authService.emailVerifyWhitMail(body.email);
      if (sender.success) {
        res.status(HttpStatus.OK).json({
          status: sender,
        });
      } else {
        res.status(HttpStatus.NOT_FOUND).json({
          status: sender,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  @Post('signIn')
  async userSignIn(@Body() body: UserSignInDto, @Res() res: Response) {
    try {
      const signIn = await this.authService.signInUser(body);
      return res.status(HttpStatus.ACCEPTED).json(signIn);
    } catch (error) {
      throw error;
    }
  }
}
