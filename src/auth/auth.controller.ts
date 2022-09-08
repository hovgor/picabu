import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'After verifying the email , you must log in to this mail to take a PIN code that lasts an hour after that the pin will not be valid . Required fields , name , smartphone ID , PIN code , email , password , password repetition , password must be at least 8 letters, of which at least one large letter and at least one digit.',
  })
  async signUp(@Body() body: UserSignUpDto, @Res() res: Response) {
    try {
      const newUser = await this.authService.createNewUser(body);
      return res.status(HttpStatus.CREATED).json(newUser);
    } catch (error) {
      throw error;
    }
  }

  @Post('signUp/verify')
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'To register in the application, you need to pass email verification, after the request you will receive a PIN code to this email.',
  })
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
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'You need an email and password to login.',
  })
  async userSignIn(@Body() body: UserSignInDto, @Res() res: Response) {
    try {
      const signIn = await this.authService.signInUser(body);
      return res.status(HttpStatus.ACCEPTED).json(signIn);
    } catch (error) {
      throw error;
    }
  }
}
