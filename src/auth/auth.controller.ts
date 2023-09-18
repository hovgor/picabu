import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  Headers,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { EmailVerifyDto } from 'src/modules/users/dto/email.verify.dto';

import { UserSignInDto } from 'src/modules/users/dto/user.signin.dto';
import { UserSignUpDto } from 'src/modules/users/dto/user.signup.dto';
import { AuthService } from './auth.service';
import { LogoutDto } from './dto/logout.dto';
import { RequestHeadersDto } from './dto/refreshTokenHeaders.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Post('signUp')
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'To register in the application, you need to pass email verification, after the request you will receive a PIN code to this email.',
  })
  async signUpVerify(@Body() body: EmailVerifyDto, @Res() res: Response) {
    try {
      const verifyUser = await this.authService.verifyUser(body);
      return res.status(HttpStatus.OK).json(verifyUser);
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

  @ApiBearerAuth()
  @Post('logout')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'For logout user you need insert token and divace id.',
  })
  async logout(@Body() body: LogoutDto, @Req() req: any, @Res() res: Response) {
    try {
      await this.authService.logout(body, req);
      return res.status(HttpStatus.NO_CONTENT).json();
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Post('logoutAllDevices')
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description:
      'For logout user you need insert token and divace id. This endpoint is deleted all tokens in database.',
  })
  async logoutAllDevices(@Req() req: any, @Res() res: Response) {
    try {
      await this.authService.logoutAllDevices(req);
      return res.status(HttpStatus.NO_CONTENT).json();
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'when expire token you can add refresh token in header and take new access and refresh tokens',
  })
  @ApiBearerAuth()
  @Post('revokeTokens')
  async revokeTokens(
    @Res() res: Response,
    @Req() req: any,
    @Headers() headers: RequestHeadersDto,
  ) {
    try {
      const newTokens = await this.authService.revokeTokens(headers);
      return res.status(HttpStatus.OK).json(newTokens);
    } catch (error) {
      throw error;
    }
  }
}
