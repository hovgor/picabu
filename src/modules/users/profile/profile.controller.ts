import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Query,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { ProfileService } from './profile.service';
import { getprofileDataDto } from '../dto/profile.dto';
import { PagedSearchDto } from 'src/shared/dto/paged.search.dto';
import { GetReactionsQuery } from './dto/getReactions.dto';
import { AuthMiddleware } from 'src/shared/middlewares/auth.middleware';
import { Follow } from 'src/shared/types/followers';
@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'You need to add an aftarization token in the header.Add in the parameters “profileOwnerId” and “follow” which can be either subscribers or subscriptions.',
  })
  @ApiBearerAuth()
  @UseInterceptors(AuthMiddleware)
  @ApiParam({ name: 'follow', enum: Follow })
  @ApiQuery({ name: 'profileOwnerId' })
  @Get('/followersCount/:follow')
  async getFollowersCount(
    @Res() res: Response,
    @Req() req: any,
    @Query('profileOwnerId') profileOwnerId: number,
    @Param('follow') follow: Follow = Follow.followers,
  ) {
    try {
      const data = await this.profileService.getFollowersCount(
        req.body,
        follow,
        profileOwnerId,
      );
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'You need to add an aftarization token in the header.Add in the parameters “profileOwnerId” and “follow” which can be either subscribers or subscriptions. In porosometers you need to add “offset” and “limit” and receive data about users',
  })
  @ApiBearerAuth()
  @UseInterceptors(AuthMiddleware)
  @ApiParam({ name: 'follow', enum: Follow })
  @ApiQuery({ name: 'profileOwnerId' })
  @Get('/followers/:follow')
  async getFollowers(
    @Query() query: PagedSearchDto,
    @Res() res: Response,
    @Req() req: any,
    @Query('profileOwnerId') profileOwnerId: number,
    @Param('follow') follow: Follow = Follow.followers,
  ) {
    try {
      const data = await this.profileService.getFollowers(
        req.body,
        query,
        follow,
        profileOwnerId,
      );
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'You need to add an aftarization token in the header. In porosometers you need to add “offset” and “limit” and receive data about users',
  })
  @ApiBearerAuth()
  @Get('/followings')
  async getFollowings(
    @Query() query: PagedSearchDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.profileService.getFollowings(req, query);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'You need to add an aftarization token in the header.',
  })
  @ApiBearerAuth()
  @Get('/createdPostsCount')
  async getCreatedPostsCount(
    // @Body() body: any,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.profileService.getCreatedPostsCount(req);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  // @ApiResponse({
  //   status: HttpStatus.ACCEPTED,
  //   description: 'You need to add an aftarization token in the header. ',
  // })
  // @ApiBearerAuth()
  // @Get('/createdPosts')
  // async getCreatedPosts(
  //   @Body() body: any,
  //   @Res() res: Response,
  //   @Req() req: any,
  // ) {
  //   try {
  //     const data = await this.profileService.getCreatedPosts(req, body);
  //     return res.status(HttpStatus.ACCEPTED).json(data);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // @ApiBearerAuth()
  // @Get('/reactedPosts')
  // async getReactedPosts(
  //   @Body() body: getprofileDataDto,
  //   @Res() res: Response,
  //   @Req() req: any,
  // ) {
  //   try {
  //     const data = await this.profileService.getReactedPosts(req, body);
  //     return res.status(HttpStatus.ACCEPTED).json(data);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'You need to add an aftarization token in the header. In porosity meters you need to add “offset” and “limit”, “reactionId” (the reaction ID you want to receive) and receive data on reactions.',
  })
  @ApiBearerAuth()
  @Get('/reactions')
  @UseInterceptors(AuthMiddleware)
  async getReactions(
    @Body() body: any,
    @Query() query: GetReactionsQuery,
    @Res() res: Response,
  ) {
    try {
      const data = await this.profileService.getReactions(query, body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'You need to add an aftarization token in the header. In porosity meters you need to add “offset” and “limit” and receive data.',
  })
  @ApiBearerAuth()
  @Get('/allMyComments')
  async getAllMyPosts(
    @Query() query: PagedSearchDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.profileService.getAllMyCommentsFunction(
        req,
        query,
      );
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }
}
