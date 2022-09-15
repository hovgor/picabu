import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ProfileService } from './profile.service';
import {
  getprofileDataDto,
  getLikedDislikedPostsCountParam,
} from '../dto/profile.dto';
@Controller('profile')
@ApiTags('Profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiBearerAuth()
  @Get('/getFollowersCount')
  async getFollowersCount(
    @Body() body: getprofileDataDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.profileService.getFollowersCount(req, body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Get('/getFollowingsCount')
  async getFollowingsCount(
    @Body() body: getprofileDataDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.profileService.getFollowingsCount(req, body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Get('/getLikedDislikedPostsCount/:reaction')
  async getLikedPostsCount(
    @Body() body: getprofileDataDto,
    @Res() res: Response,
    @Req() req: any,
    @Param() param: getLikedDislikedPostsCountParam,
  ) {
    try {
      const data = await this.profileService.getLikedDislikedPostsCount(
        req,
        body,
        param,
      );
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Get('/getFollowers')
  async getFollowers(
    @Body() body: getprofileDataDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.profileService.getFollowers(req, body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Get('/getFollowings')
  async getFollowings(
    @Body() body: getprofileDataDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.profileService.getFollowers(req, body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Get('/getCreatedPostsCount')
  async getCreatedPostsCount(
    @Body() body: getprofileDataDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.profileService.getCreatedPostsCount(req, body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Get('/getCreatedPosts')
  async getCreatedPosts(
    @Body() body: getprofileDataDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.profileService.getCreatedPosts(req, body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }
}
