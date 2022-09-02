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
import { ReactionsDto } from './dto/reactions.dto';
import { UsersService } from './users.service';
import { CommentDto } from './dto/comment.dto'
import { CommentsReactionsDto } from './dto/comments.reactions.dto';
@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
