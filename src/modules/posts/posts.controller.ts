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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AddToFAvoritesDto } from './dto/add.to.favorites.dto';
import { CreatePostBodyDto } from './dto/create.post.body.dto';
import { FilterSearchDto } from './dto/filter.search.dto';
import { PostsService } from './posts.service';
import { TagsService } from './tags/tags.service';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly tagsService: TagsService,
  ) {}

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

  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Delete(':id')
  async deletePost(
    @Res() res: Response,
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      await this.postsService.deletePost(id, req);
      return res.status(HttpStatus.NO_CONTENT).json({
        data: null,
        error: false,
      });
    } catch (error) {
      throw error;
    }
  }

  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @Post('add-to-favorites')
  async addPostToFavorites(
    @Res() res: Response,
    @Req() req,
    @Body() body: AddToFAvoritesDto,
  ) {
    try {
      const favorite = await this.postsService.addPostToFavorites(
        body.categoriesId,
        body.postId,
        req,
      );
      return res.status(HttpStatus.ACCEPTED).json(favorite);
    } catch (error) {
      throw error;
    }
  }

  @UsePipes(new ValidationPipe())
  // @ApiBearerAuth()
  @Get('/search-by-title')
  async getPostByTitleSearch(
    @Req() req: any,
    @Res() res: Response,
    @Query() query: FilterSearchDto,
  ) {
    try {
      const search = await this.postsService.searchByTitlePost(query, req);
      return res.status(HttpStatus.OK).json(search);
    } catch (error) {
      throw error;
    }
  }

  @UsePipes(new ValidationPipe())
  // @ApiBearerAuth()
  @Get('/search-by-tags')
  async getPostByTagsSearch(
    @Req() req: any,
    @Res() res: Response,
    @Query() query: FilterSearchDto,
  ) {
    try {
      const search = await this.postsService.searchByTagsPost(query, req);
      return res.status(HttpStatus.OK).json(search);
    } catch (error) {
      throw error;
    }
  }

  // get posts by attachments
  @UsePipes(new ValidationPipe())
  // @ApiBearerAuth()
  @Get('/search-by-attachments')
  async getPostByAttachmentsSearch(
    @Req() req: any,
    @Res() res: Response,
    @Query() query: FilterSearchDto,
  ) {
    try {
      const search = await this.postsService.searchByTagsPost(query, req);
      return res.status(HttpStatus.OK).json(search);
    } catch (error) {
      throw error;
    }
  }

  // get posts
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

  // get tags
  @UsePipes(new ValidationPipe())
  @Get(':id')
  async gettags(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const post = await this.postsService.getPostById(id);

      return res.status(HttpStatus.OK).json(post);
    } catch (error) {
      throw error;
    }
  }

  // @UsePipes(new ValidationPipe())
  // @Patch('like-count/:id')
  // async likeCountPost(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Res() res: Response,
  // ) {
  //   try {
  //     const post = await this.postsService.getPostById(id);

  //     return res.status(HttpStatus.OK).json(post);
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}
