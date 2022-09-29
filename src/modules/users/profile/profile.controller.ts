import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ProfileService } from './profile.service';
import { getprofileDataDto } from '../dto/profile.dto';
import { PagedSearchDto } from 'src/shared/search/paged.search.dto';

@ApiTags('Profile')
@Controller('profile')
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
  @Get('/getLikedDislikedPostsCount')
  async getLikedPostsCount(
    @Body() body: getprofileDataDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.profileService.getLikedDislikedPostsCount(
        req,
        body,
      );
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Get('/getFollowers')
  async getFollowers(
    @Query() query: PagedSearchDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.profileService.getFollowers(req, query);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Get('/getFollowings')
  async getFollowings(
    @Body() body: any,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.profileService.getFollowings(req, body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Get('/getCreatedPostsCount')
  async getCreatedPostsCount(
    @Body() body: any,
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
    @Body() body: any,
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

  @ApiBearerAuth()
  @Get('/getReactedPosts')
  async getReactedPosts(
    @Body() body: getprofileDataDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.profileService.getReactedPosts(req, body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }
}
