import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ReactionsDto } from './dto/reactions.dto';
import { UsersService } from './users.service';
import { ReplyCommentDto } from './dto/comment.dto';
import { CommentsReactionsDto } from './dto/comments.reactions.dto';
import { FeedDto } from './dto/feed.dto';
import { followUnfollowDto } from './dto/follow.unfollow.dto';
import { BlockedUserDto } from './dto/blocked.user.dto';
import { CommentDto } from './dto/comment.one.dto';
import { FeedStatus } from 'src/shared/types/feed.status';
import { PagedSearchDto } from 'src/shared/search/paged.search.dto';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'To reaction in post, you need to add reaction type (reaction type most be -1, 0, 1). And add the token to the jogoheads.',
  })
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

  // comment posts
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'To comment in post, you need to add his id and comment in the body. And add the token to the jogoheads.',
  })
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

  // reply comment post
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'To replay comment in post, you need to add his id and comment and parrent comment id in the body. And add the token to the jogoheads.',
  })
  @ApiBearerAuth()
  @Post('/replyCommentPost')
  async replyCommentPost(
    @Body() body: ReplyCommentDto,
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

  @Get('getCommentOfTheDay')
  async getCommentOfTheDay(
    @Res() res: Response,
    @Query() query: PagedSearchDto,
  ) {
    try {
      const data = await this.usersService.getCommentOfTheDay(query);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'To reaction in comment, you need to add reaction type (reaction type most be -1, 0, 1) and comment id. And add the token to the jogoheads.',
  })
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

  // subscribe group
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'To subscribe a group, you need to add his id(group id). And add the token to the jogoheads.',
  })
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

  // unsubscribe group
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'To unsubscribe a group, you need to add his id(group id). And add the token to the jogoheads.',
  })
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

  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'To subscribe a user, you need to add following user id(follow to id). And add the token to the jogoheads.',
  })
  @ApiBearerAuth()
  @Post('/followUser')
  async followUser(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: followUnfollowDto,
  ) {
    try {
      const data = await this.usersService.followUser(body, req);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description:
      'To unsubscribe a user, you need to add following user id(follow to id). And add the token to the jogoheads.',
  })
  @Delete('/unfollowUser')
  async followUnfollowUser(
    @Req() req: any,
    @Res() res: Response,
    @Body() body: followUnfollowDto,
  ) {
    try {
      const data = await this.usersService.unfollowUser(body, req);
      return res.status(HttpStatus.NO_CONTENT).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Post('/feed')
  @ApiQuery({ name: 'status', enum: FeedStatus })
  async getFeedEndpoint(
    @Req() req: any,
    @Res() res: Response,
    @Query('status') status: string,
    @Body() body: FeedDto,
  ) {
    try {
      const getFeed = await this.usersService.getFeed(status, body, req);
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
  ) {
    try {
      const user = await this.usersService.getUserById(id, req);
      res.status(HttpStatus.OK).json(user);
    } catch (error) {
      throw error;
    }
  }

  // blocked user
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'To block a user, you need to add his id. And add the token to the jogoheads.',
  })
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
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'To unblock a user, you need to add his id. And add the token to the jogoheads.',
  })
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
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Add a token and it will show all blockers (black list).',
  })
  @Get('/getBlockedUsers')
  async getBlockedUsers(@Res() res: Response, @Req() req: any) {
    try {
      const data = await this.usersService.getBlockedList(req);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }
}
