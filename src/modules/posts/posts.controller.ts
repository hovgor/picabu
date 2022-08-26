import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreatePostBodyDto } from './dto/create.post.body.dto';
import { PostsEntityBase } from './entity/posts.entity';
import { PostsService } from './posts.service';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  // @ApiConsumes('multipart/form-data')
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

  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Delete(':id')
  async deletePost(
    @Res() res: Response,
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const deletePost = await this.postsService.deletePost(id, req);
      return res.status(HttpStatus.NO_CONTENT).json({
        data: null,
        error: false,
      });
    } catch (error) {
      throw error;
    }
  }

  @UsePipes(new ValidationPipe())
  @Get(':id')
  async getPost(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const post = await this.postsService.getPostById(id);

      return res.status(HttpStatus.OK).json(post);
    } catch (error) {
      throw error;
    }
  }
}
