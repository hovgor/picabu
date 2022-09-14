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
import { ReactionsDto } from './dto/reactions.dto';
import { UsersService } from './users.service';
import { CommentDto } from './dto/comment.dto';
import { CommentsReactionsDto } from './dto/comments.reactions.dto';
import { BlockedUserDto } from './dto/blocked.user.dto';
import { EditProfileDto } from './dto/edit.profile.dto';
import { FeedDto, FeedParamsDto } from './dto/feed.dto';
import { followUnfollowDto } from './dto/follow.unfollow.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @Post('/reactUnreactPost')
  async reactUnreactPost(
    @Body() body: ReactionsDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.usersService.reactPost(body, req);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Post('/commentPost')
  async commentPost(
    @Body() body: CommentDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.usersService.commentPost(body, req);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Post('/replyCommentPost')
  async replyCommentPost(
    @Body() body: CommentDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.usersService.replyCommentPost(body, req);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  // blocked user
  @ApiBearerAuth()
  @Post('/blockedUser')
  async blockedUser(
    @Body() body: BlockedUserDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.usersService.toBlockedUser(body.userId, req);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  // unblocked user
  @ApiBearerAuth()
  @Post('/unblockedUser')
  async unBlockedUser(
    @Body() body: BlockedUserDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.usersService.toUnBlockedUser(body.userId, req);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  // get all blocked users
  @ApiBearerAuth()
  @Get('/getBlockedUsers')
  async getBlockedUsers(
    // @Body() body: BlockedUserDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.usersService.getBlockedList(req);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }
  @ApiBearerAuth()
  @Post('/reactUnreactComment')
  async reactUnreactComment(
    @Body() body: CommentsReactionsDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.usersService.reactComment(body, req);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Post('/subscribe/:groupId')
  async subscribeGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      const subscribe = await this.usersService.subscribeGroup(groupId, req);
      return res.status(HttpStatus.ACCEPTED).json(subscribe);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Post('/unsigned/:groupId')
  async unsignedGroup(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      const subscribe = await this.usersService.unsignedGroup(groupId, req);
      return res.status(HttpStatus.ACCEPTED).json(subscribe);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Patch('editProfile')
  async editeProfile(
    @Body() body: EditProfileDto,
  @Post('/followUnfollowUser')
  async followUnfollowUser(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: followUnfollowDto,
  ) {
    try {
      const userId = body.userId;
      const followToId = body.followToId;
      const data = body.userFollowsAccount
        ? await this.usersService.unfollowUser(userId, followToId)
        : await this.usersService.followUser(userId, followToId);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Get('/feed/:status')
  async getFeed(
    @Param('status') param: FeedParamsDto,
    @Req() req: any,
    @Res() res: Response,
    @Body() body: FeedDto,
  ) {
    try {
      const getFeed = await this.usersService.getFeed(param.status, body);
      return res.status(HttpStatus.ACCEPTED).json(getFeed);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
    @Req() req: any,
    @Res() res: Response,
  ) {
    try {
      const editing = await this.usersService.editProfile(body, req);
      return res.status(HttpStatus.ACCEPTED).json(editing);
    } catch (error) {
      throw error;
    }
  }
}
