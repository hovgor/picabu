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
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { PostReactions } from 'src/shared/types/reactions';
import { AddToFAvoritesDto } from './dto/add.to.favorites.dto';
import { CreatePostBodyDto } from './dto/create.post.body.dto';
import { FilterSearchDto } from './dto/filter.search.dto';
import { ReactionTypeForPostDto } from './dto/reaction.type.dto';
import { PostsService } from './posts.service';
import { ReactionIconsService } from './reaction-icons/reaction-icons.service';
import { TagsService } from './tags/tags.service';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly tagsService: TagsService,
    private readonly reactionIconsService: ReactionIconsService,
  ) {}

  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Create posts. To create a post , you need a mandatory field , a header, at least three tags , a description of the post is not necessary , an attachment is not desirable.',
  })
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
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete post by id. Id most be a number.',
  })
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
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'Add reactions to posts. The reaction to the post is like an array , but eventually it becomes numbers . There are fixed types of reactions .',
  })
  @ApiQuery({ name: 'reactionType', enum: PostReactions })
  @Post('addReactionIcon')
  async addReactionForPost(
    @Res() res: Response,
    @Req() req: any,
    @Query('reactionType') reactionType: PostReactions = PostReactions.default,
    @Body() body: ReactionTypeForPostDto,
  ) {
    try {
      const reaction = await this.reactionIconsService.addReactionIconsForPosts(
        body.postId,
        req,
        reactionType,
      );
      return res.status(HttpStatus.ACCEPTED).json(reaction);
    } catch (error) {
      throw error;
    }
  }

  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'Add a post to the favorites category. It is necessary to insert the category ID and post id into the body.',
  })
  @Post('addToFavorites')
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
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'The body shows offset and limit, optional fields. In order to find a post there is a beginning field, get by post name. If all inputs null endpoint get all.',
  })
  @Get('/searchByTitle')
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
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'The body shows offset and limit, optional fields. In order to find a post there is a beginning field, get by tags name. If all inputs null endpoint get all.',
  })
  @Get('/searchByTags')
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
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'The body shows offset and limit, optional fields. In order to find a post there is a beginning field, get by attachment name. If all inputs null endpoint get all.',
  })
  @Get('/searchByAttachments')
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Find posts by ID.',
  })
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
  // @UsePipes(new ValidationPipe())
  //   @ApiResponse({
  //   status: HttpStatus.OK,
  //   description: 'Find posts by ID.',
  // })
  // @Get(':id')
  // async gettags(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
  //   try {
  //     const post = await this.postsService.getPostById(id);

  //     return res.status(HttpStatus.OK).json(post);
  //   } catch (error) {
  //     throw error;
  //   }
  // }

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
