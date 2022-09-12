import { Body, Controller, HttpStatus, Patch, Post, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Change1PasswordDto } from '../dto/change.password.dto';
import { ForgotPasswordDto } from '../dto/forgot.password.dto';
import { VerifyPinCodeDto } from '../dto/pin.verify.dto';

import { PasswordService } from './password.service';

@Controller('password')
@ApiTags('Password')
export class PasswordController {
  constructor(private readonly passwordService: PasswordService) {}

  @Patch('changePassword')
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'After verification of the PIN code, you need to send an email with new passwords with password validation, and the generated ticket.',
  })
  async changePassword(@Body() body: Change1PasswordDto, @Res() res: Response) {
    try {
      const changePass = await this.passwordService.changePassword(body);
      return res.status(HttpStatus.ACCEPTED).json(changePass);
    } catch (error) {
      throw error;
    }
  }

  @Post('forgotPassword')
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'To restore the password, you need to verify the email. A PIN code will be sent to the mail.',
  })
  async forgotPassword(@Body() body: ForgotPasswordDto, @Res() res: Response) {
    try {
      const forgot = await this.passwordService.forgotPassword({
        email: body.email,
      });
      return res.status(HttpStatus.ACCEPTED).json({
        forgot,
      });
    } catch (error) {
      throw error;
    }
  }

  @Post('verifyPin')
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'After verification of the email , it is necessary to verify the PIN code . Required fields are Pin code and email, after that endpoint will generate a ticket.',
  })
  async verifyPinCode(@Body() body: VerifyPinCodeDto, @Res() res: Response) {
    try {
      const verify = await this.passwordService.verifyPinCode(body);
      res.status(HttpStatus.ACCEPTED).json(verify);
    } catch (error) {
      throw error;
    }
  }
}
