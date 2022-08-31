import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreatePostBodyDto } from './dto/create.post.body.dto';
import { PostsService } from './posts.service';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Post('/create')
  async createPost(
    @Body() body: CreatePostBodyDto,
    @Res() res: Response,
    @Req() req,
  ) {
    try {
      const post = await this.postsService.createPost(body, req);
      return res.status(HttpStatus.CREATED).json(post);
    } catch (error) {
      throw error;
    }
  }
}
