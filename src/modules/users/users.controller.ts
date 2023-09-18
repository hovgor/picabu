import {
  BadRequestException,
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
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { ReplyCommentDto } from './dto/reply.dto';
import { CommentsReactionsDto } from './dto/comments.reactions.dto';
import { BlockedUserDto } from './dto/blocked.user.dto';
import { CommentDto } from './dto/comment.dto';
import { FeedStatus } from 'src/shared/types/feed.status';
import { PagedSearchDto } from 'src/shared/dto/paged.search.dto';
import { QuestionsDto } from './settings/dto/questions.dto';
import { FeedQuery } from './dto/feed.query.dto';
import { DontReccomendDto } from './dto/dont.recommend.dto';
import { AuthMiddleware } from 'src/shared/middlewares/auth.middleware';
import { TargetType } from 'src/shared/types/rate_target';
import { RateDto } from './dto/rate.dto';
import { FollowTargetType } from './dto/followParam.dto';
import { followUnfollowBodyDto } from './dto/followBody.dto';
import { AcceptFollowRequestDto } from './dto/acceptFollowBody.dto';
import { Paginate } from './dto/paginate.dto';
import { ReportBodyDto } from './dto/reportBody.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // comment posts
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'To comment in post, you need to add post id and comment in the body. To change comment add commentId.',
  })
  @ApiBearerAuth()
  @Post('/upsertComment')
  @UseInterceptors(AuthMiddleware)
  async commentPost(@Body() body: CommentDto, @Res() res: Response) {
    try {
      const data = await this.usersService.commentPost(body);
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
  @Post('/upsertReply')
  @UseInterceptors(AuthMiddleware)
  async replyCommentPost(@Body() body: ReplyCommentDto, @Res() res: Response) {
    try {
      const data = await this.usersService.replyCommentPost(body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get comment of the day. ',
  })
  @ApiBearerAuth()
  @UseInterceptors(AuthMiddleware)
  @Get('commentOfTheDay')
  async getCommentOfTheDay(
    @Res() res: Response,
    @Query() query: PagedSearchDto,
    @Req() req: Request,
  ) {
    try {
      const data = await this.usersService.getCommentOfTheDay(query, req.body);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete comment by id',
  })
  @ApiBearerAuth()
  @Delete('comment/:id')
  async deleteCommentById(
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      await this.usersService.deleteCommentById(req, id);
      return res.status(HttpStatus.NO_CONTENT).json();
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'To react comment Mention comment id and reaction id !',
  })
  @Post('/reactComment')
  @UseInterceptors(AuthMiddleware)
  async reactComment(@Body() body: CommentsReactionsDto, @Res() res: Response) {
    try {
      const data = await this.usersService.reactComment(body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'Add a “user” or “community” goal in the parameters. and then add "relatedId" & "status".',
  })
  @Post('/followUnfollow/:target')
  @UseInterceptors(AuthMiddleware)
  async followUnfollow(
    @Param('target') target: FollowTargetType,
    @Res() res: Response,
    @Body() body: followUnfollowBodyDto,
  ) {
    if (target != 'user' && target != 'community')
      throw new BadRequestException('Wrong Param Sent !');
    try {
      const data = await this.usersService.followUnfollow(body, target);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'get follow requests.  You need to add "offset" and "limit". You need to add an aftarization token in the header.',
  })
  @ApiBearerAuth()
  @Get('/followRequests')
  @UseInterceptors(AuthMiddleware)
  async getFollowRequests(
    @Query() query: Paginate,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.usersService.getFollowRequests(query, req.body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'You need to add an aftarization token in the header. You need to add "follower Id" & "community Id" to the body.  ',
  })
  @ApiBearerAuth()
  @Post('/declineFollowRequest')
  @UseInterceptors(AuthMiddleware)
  async declineFollowRequest(
    @Res() res: Response,
    @Body() body: AcceptFollowRequestDto,
  ) {
    try {
      const data = await this.usersService.declineFollowRequest(body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'You need to add an aftarization token in the header. You need to add "follower Id" & "community Id" to the body.  ',
  })
  @ApiBearerAuth()
  @Post('/acceptFollowRequest')
  @UseInterceptors(AuthMiddleware)
  async acceptFollowRequest(
    @Res() res: Response,
    @Body() body: AcceptFollowRequestDto,
  ) {
    try {
      const data = await this.usersService.acceptFollowRequest(body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'You need to add an aftarization token in the header.Get subscribe requests.  You need to add "offset" and "limit". ',
  })
  @ApiBearerAuth()
  @Get('/subscribeRequests')
  @UseInterceptors(AuthMiddleware)
  async getSubscribeRequests(
    @Query() query: Paginate,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.usersService.getSubscribeRequests(
        query,
        req.body,
      );
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'You need to add an aftarization token in the header.To receive user feed, it is not necessary to be aftarized, but in this case you cannot use “myFeed” parameter only “new” and “top”.',
  })
  @ApiBearerAuth()
  @Get('/feed')
  @ApiQuery({ name: 'status', enum: FeedStatus })
  async getFeedEndpoint(
    @Req() req: any,
    @Res() res: Response,
    @Query() query: FeedQuery,
  ) {
    try {
      const getFeed = await this.usersService.getFeed(query, req);
      return res.status(HttpStatus.ACCEPTED).json(getFeed);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'You need to add an aftarization token in the header. Add in the parameters the user ID about whom you want to view data.',
  })
  @ApiBearerAuth()
  @Get('profileData')
  @UseInterceptors(AuthMiddleware)
  async getUserById(
    @Query('ownerId', ParseIntPipe) ownerId: number,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const user = await this.usersService.getUserById(ownerId, req);
      res.status(HttpStatus.OK).json(user);
    } catch (error) {
      throw error;
    }
  }

  // blocked user
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'You need to add an aftarization token in the header. To block a user, you need to add his id. And add the token to the jogoheads.',
  })
  @ApiBearerAuth()
  @Post('/block')
  @UseInterceptors(AuthMiddleware)
  async blockedUser(@Body() body: BlockedUserDto, @Res() res: Response) {
    try {
      const data = await this.usersService.toBlockedUser(body);
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
      'You need to add an aftarization token in the header. To unblock a user, you need to add his id. And add the token to the jogoheads.',
  })
  @Post('/unblocked')
  async unBlockedUser(
    @Body() body: BlockedUserDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.usersService.toUnBlockedUser(
        body.blockUserId,
        req,
      );
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'You need to add an aftarization token in the header. Add or add posts that you don’t want to be recommended to watch',
  })
  @Post('/dontRecommend')
  async dontRecommend(
    @Body() body: DontReccomendDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.usersService.dontRecommend(body, req);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Report !',
  })
  @Post('/report')
  @UseInterceptors(AuthMiddleware)
  async report(@Body() body: ReportBodyDto, @Res() res: Response) {
    try {
      const data = await this.usersService.report(body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  // get all blocked users
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Add a token and it will show all blockers (black list).',
  })
  @UseInterceptors(AuthMiddleware)
  @Get('/allBlocked')
  async getBlockedUsers(
    @Res() res: Response,
    @Req() req: any,
    @Query() query: Paginate,
  ) {
    try {
      const data = await this.usersService.getBlockedList(query, req);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      throw error;
    }
  }

  // get all blocked users
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Add a token and it will show all blockers count (black list count).',
  })
  @UseInterceptors(AuthMiddleware)
  @Get('/allBlockedCount')
  async getBlockedUsersCount(@Res() res: Response, @Req() req: any) {
    try {
      const data = await this.usersService.getBlockedListCount(req);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Help',
  })
  @ApiBearerAuth()
  @Get('/help')
  async help(@Res() res: Response, @Req() req: any) {
    try {
      const helpFaqs = await this.usersService.getHelp(req);
      res.status(HttpStatus.OK).json(helpFaqs);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Help',
  })
  @ApiBearerAuth()
  @Post('/sendQuestion')
  async sendQuestion(
    @Res() res: Response,
    @Body() body: QuestionsDto,
    @Req() req: any,
  ) {
    try {
      const sendQuestion = await this.usersService.sendQuestion(body, req);
      res.status(HttpStatus.OK).json(sendQuestion);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'To react comment Mention comment id and reaction id !',
  })
  @Post('/rate/:target')
  @UseInterceptors(AuthMiddleware)
  async rate(
    @Param('target') target: TargetType,
    @Body() body: RateDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.usersService.rate(body, target);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }
}
