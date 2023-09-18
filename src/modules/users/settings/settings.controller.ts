import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { SettingsService } from './SettingsService';
import { UsersService } from '../users.service';
import {
  ChangePhotoDto,
  ChangeNicknameDto,
  ChangeEmailDto,
  ChangePasswordDto,
  VerifyEmailDto,
  VerifyPhoneDto,
  DeleteAccountDto,
} from '../dto/settings.dto';
// import { upsertPhoneNumberDto } from '../dto/upsert.phoneNumber.dto';
import { HelpCenterDto } from './dto/help.center.dto';
import {
  PRIVACY_POLICY,
  TERMS_AND_CONDITIONS,
} from 'src/shared/utils/privacy.policy';
import { AuthMiddleware } from 'src/shared/middlewares/auth.middleware';

@Controller('settings')
@ApiTags('Settings')
export class settingsController {
  constructor(
    private readonly settingsService: SettingsService,
    private readonly usersService: UsersService,
  ) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'You need to add an aftarization token in the header. Add profile photo url in body.',
  })
  @ApiBearerAuth()
  @Patch('/profilePhoto')
  @UseInterceptors(AuthMiddleware)
  async changeProfilePhopto(
    @Body() body: ChangePhotoDto,
    @Res() res: Response,
  ) {
    try {
      const profilePhoto = await this.settingsService.changeProfilePhoto(body);
      res.status(HttpStatus.OK).json(profilePhoto);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'You need to add an aftarization token in the header.',
  })
  @ApiBearerAuth()
  @Delete('/deleteProfilePhoto')
  @UseInterceptors(AuthMiddleware)
  async deleteProfilePhoto(@Body() body: any, @Res() res: Response) {
    try {
      const profilePhoto = await this.settingsService.deleteProfilePhoto(body);
      res.status(HttpStatus.OK).json(profilePhoto);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'You need to add an aftarization token in the header. Add nickname and password in body.',
  })
  @ApiBearerAuth()
  @Patch('/nickname')
  async changeUserName(
    @Body() body: ChangeNicknameDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const changeNickname = await this.settingsService.changeNickname(
        body,
        req,
      );

      return res.status(HttpStatus.OK).json(changeNickname);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'You need to add an aftarization token in the header. Add password and email in body.',
  })
  @ApiBearerAuth()
  @UseInterceptors(AuthMiddleware)
  @Patch('/email/verify')
  async changeEmailVerify(
    @Body() body: VerifyEmailDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const changeEmailVerify = await this.settingsService.changeEmailVerify(
        body,
        req,
      );
      res.status(HttpStatus.OK).json(changeEmailVerify);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'You need to add an aftarization token in the header. Add password and pin in body.',
  })
  @ApiBearerAuth()
  @UseInterceptors(AuthMiddleware)
  @Patch('/email/confirm')
  async changeEmailConfirm(
    @Body() body: ChangeEmailDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const changeEmailConfirm = await this.settingsService.changeEmailConfirm(
        body.email,
        body.pin,
        req.body,
      );
      return res.status(HttpStatus.OK).json(changeEmailConfirm);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'You need to add an aftarization token in the header. Add password and new password in body.',
  })
  @UseInterceptors(AuthMiddleware)
  @ApiBearerAuth()
  @Patch('/password')
  async changePassword(@Body() body: ChangePasswordDto, @Res() res: Response) {
    try {
      const changePassword = await this.settingsService.changePassword(body);
      return res.status(HttpStatus.OK).json(changePassword);
    } catch (error) {
      throw error;
    }
  }

  // @ApiBearerAuth()
  // @Patch('/profile')
  // async editeProfile(
  //   @Body() body: EditProfileDto,
  //   @Req() req: any,
  //   @Res() res: Response,
  // ) {
  //   try {
  //     const editing = await this.settingsService.editProfile(body, req);
  //     return res.status(HttpStatus.ACCEPTED).json(editing);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'You need to add an aftarization token in the header. Add password and new phone number in body.',
  })
  @ApiBearerAuth()
  @UseInterceptors(AuthMiddleware)
  @Patch('/phone/verify')
  async changePhoneVerify(@Body() body: VerifyPhoneDto, @Res() res: Response) {
    try {
      const editing = await this.settingsService.changePhoneVerify(body);
      return res.status(HttpStatus.ACCEPTED).json(editing);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'You need to add an aftarization token in the header. Add password and pin in body.',
  })
  @ApiBearerAuth()
  @UseInterceptors(AuthMiddleware)
  @Patch('/phone/confirm')
  async changePhoneConfirm(
    @Body() body: any,
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      const editing = await this.settingsService.changePhoneConfirm(body, req);
      return res.status(HttpStatus.ACCEPTED).json(editing);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'You need to add an aftarization token in the header.',
  })
  @ApiBearerAuth()
  @Put('/changePrivacy')
  @UseInterceptors(AuthMiddleware)
  async changePrivacy(@Body() body: any, @Res() res: Response) {
    try {
      const data = await this.settingsService.changePrivacy(body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'You need to add an aftarization token in the header. And in the body add the message you want to send.',
  })
  @ApiBearerAuth()
  @Post('/usersHelpCenter')
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

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'You need to add an aftarization token in the header.',
  })
  @UseInterceptors(AuthMiddleware)
  @Get('/myReatingCount')
  async myReatingCount(@Req() req: any, @Res() res: Response) {
    try {
      const reatingCount = await this.settingsService.getMyReatingCount(req);
      return res.status(HttpStatus.OK).json(reatingCount);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'You need to add an aftarization token in the header.',
  })
  @UseInterceptors(AuthMiddleware)
  @ApiBearerAuth()
  @Get('/editPageProfileData')
  async editPageProfileData(@Req() req: any, @Res() res: Response) {
    try {
      const reatingCount = await this.settingsService.editPageProfileData(
        req.body,
      );
      return res.status(HttpStatus.OK).json(reatingCount);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'get privacy policy.',
  })
  @Get('privacyPolicy')
  async getPrivacyPolicy(@Res() res: Response) {
    const data = PRIVACY_POLICY;
    return res.status(HttpStatus.OK).json({
      data: data,
      success: true,
      message: 'here is your Privacy Policy',
    });
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'get Terms and Conditions.',
  })
  @Get('Terms&Conditions')
  async getTermsAndConditions(@Res() res: Response) {
    const data = TERMS_AND_CONDITIONS;
    return res.status(HttpStatus.OK).json({
      data: data,
      success: true,
      message: 'here is your Terms and Conditions',
    });
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description:
      'You need to add an aftarization token in the header. Add password in body.',
  })
  @ApiBearerAuth()
  @UseInterceptors(AuthMiddleware)
  @Delete('account')
  async deleteAccount(@Body() body: DeleteAccountDto, @Res() res: Response) {
    const deleted = await this.usersService.deleteUserWhitId(body);
    return res.status(HttpStatus.NO_CONTENT).json(deleted);
  }
}
