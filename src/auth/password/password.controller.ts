import { Body, Controller, HttpStatus, Patch, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
  async changePassword(@Body() body: Change1PasswordDto, @Res() res: Response) {
    try {
      const changePass = await this.passwordService.changePassword(body);
      return res.status(HttpStatus.ACCEPTED).json(changePass);
    } catch (error) {
      throw error;
    }
  }

  @Post('forgotPassword')
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
  async verifyPinCode(@Body() body: VerifyPinCodeDto, @Res() res: Response) {
    try {
      const verify = await this.passwordService.verifyPinCode(body);
      res.status(HttpStatus.ACCEPTED).json(verify);
    } catch (error) {
      throw error;
    }
  }
}
