import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SettingsService } from './settings.service';
import {
  ChangePhotoDto,
  ChangeNicknameDto,
  ChangeEmailDto,
  ChangePasswordDto,
} from '../dto/settings.dto';
import { EditProfileDto } from '../dto/edit.profile.dto';
import { HelpCenterDto } from './dto/help.center.dto';
@Controller('settings')
@ApiTags('Settings')
export class settingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiBearerAuth()
  @Get('/changeProfilePhopto/:id')
  async changeProfilePhopto(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ChangePhotoDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const profilePhoto = await this.settingsService.changeProfilePhoto(
        id,
        req,
      );
      res.status(HttpStatus.OK).json(profilePhoto);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Get('/changeProfilePhopto/:id')
  async deleteProfilePhopto(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ChangePhotoDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const profilePhoto = await this.settingsService.deleteProfilePhopto(
        id,
        req,
      );
      res.status(HttpStatus.OK).json(profilePhoto);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Get('/changeName/:id')
  async changeUserName(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ChangeNicknameDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const changeNickname = await this.settingsService.changeNickname(id, req);
      res.status(HttpStatus.OK).json(changeNickname);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Get('/changeEmail/verify')
  async changeEmailVerify(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ChangeEmailDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const email = body.email;
      const id = body.id;
      const changeEmailVerify = await this.settingsService.changeEmailVerify(
        id,
        email,
        req,
      );
      res.status(HttpStatus.OK).json(changeEmailVerify);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Get('/changeEmail/confirm')
  async changeEmailConfirm(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ChangeEmailDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const email = body.email;
      const id = body.id;
      const pin = body.pin;
      const changeEmailConfirm = await this.settingsService.changeEmailConfirm(
        id,
        email,
        pin,
        req,
      );
      res.status(HttpStatus.OK).json(changeEmailConfirm);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Get('/changePassword')
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ChangePasswordDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const id = body.id;
      const password = body.password;
      const newPassword = body.newPassword;
      const changePassword = await this.settingsService.changePassword(
        id,
        password,
        newPassword,
        req,
      );
      res.status(HttpStatus.OK).json(changePassword);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Patch('editProfile')
  async editeProfile(
    @Body() body: EditProfileDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      const editing = await this.settingsService.editProfile(body, req);
      return res.status(HttpStatus.ACCEPTED).json(editing);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Post('usersHelpCenter')
  async usersHelpCenter(
    @Body() body: HelpCenterDto,
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      const helpCenter = await this.settingsService.usersHelpCenter(
        body.message,
        req,
      );
      return res.status(HttpStatus.ACCEPTED).json(helpCenter);
    } catch (error) {
      throw error;
    }
  }
}
