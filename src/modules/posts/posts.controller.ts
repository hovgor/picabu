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
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { PostReactions } from 'src/shared/types/reactions';
import { AddToFAvoritesDto } from './dto/add.to.favorites.dto';
import { CreatePostBodyDto } from './dto/create.post.body.dto';
import { FilterSearchDto } from './dto/filter.search.dto';
import { ReactionTypeForPostDto } from './dto/reaction.type.dto';
import { PostsService } from './posts.service';
import { ReactionIconsService } from './reaction-icons/reaction-icons.service';
import { AddToGroupDto } from './dto/add.to.group.dto';
import { PagedSearchDto } from 'src/shared/dto/paged.search.dto';
import { ReactPostDto } from './dto/react.post.dto';
import { AuthMiddleware } from 'src/shared/middlewares/auth.middleware';
import { GetCommentsDto } from './dto/getComments.dto';
import { GetRepliesDto } from './dto/getReplies.dto';
import { GetReactionsList } from './dto/getReactionList.dto';
import { Paginate } from '../users/dto/paginate.dto';

@Controller('posts')
@ApiTags('Posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly reactionIconsService: ReactionIconsService,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Create posts. To create a post , you need a mandatory field , a header, at least three tags , a description of the post is not necessary , an attachment is not desirable.',
  })
  @Post('/create')
  @UseInterceptors(AuthMiddleware)
  async createPost(@Body() body: CreatePostBodyDto, @Res() res: Response) {
    try {
      const post = await this.postsService.createPost(body);
      return res.status(HttpStatus.CREATED).json(post);
    } catch (error) {
      throw error;
    }
  }

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
    @Query('reactionType') reactionType: PostReactions = PostReactions.Default,
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

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'Add a post to the favorites category. It is necessary to insert the post Id in the body.',
  })
  @Post('addToFavorites')
  @UseInterceptors(AuthMiddleware)
  async addPostToFavorites(
    @Res() res: Response,
    @Body() body: AddToFAvoritesDto,
  ) {
    try {
      const data = await this.postsService.addPostToFavorites(body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Get favorite posts list.',
  })
  @Get('getFavorites')
  @UseInterceptors(AuthMiddleware)
  async getFavorites(
    @Res() res: Response,
    @Body() body: any,
    @Query() query: Paginate,
  ) {
    try {
      const data = await this.postsService.getFavorites(body, query);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description:
      'Delete post from favorites ! It is necessary to insert the post Id in the body.',
  })
  @Delete('deleteFromFavorites')
  @UseInterceptors(AuthMiddleware)
  async deleteFromFavorites(
    @Res() res: Response,
    @Body() body: AddToFAvoritesDto,
  ) {
    try {
      const data = await this.postsService.deleteFromFavorites(body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'Add a post to the group . It is necessary to insert the group ID and post id into the body.',
  })
  @Post('addToGroup')
  async addToGroup(
    @Res() res: Response,
    @Req() req,
    @Body() body: AddToGroupDto,
  ) {
    try {
      const favorite = await this.postsService.addPostToGroup(body, req);
      return res.status(HttpStatus.ACCEPTED).json(favorite);
    } catch (error) {
      throw error;
    }
  }

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
      const search = await this.postsService.searchByTitlePost(query);
      return res.status(HttpStatus.OK).json(search);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'The body shows offset and limit, optional fields. In order to find a post there is a beginning field, get by tags.',
  })
  @Get('/samePosts/:id')
  async getSamePosts(
    @Res() res: Response,
    @Query() query: PagedSearchDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const search = await this.postsService.getSamePosts(query, id);
      return res.status(HttpStatus.OK).json(search);
    } catch (error) {
      throw error;
    }
  }

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
      const search = await this.postsService.searchByTagsPost(query);
      return res.status(HttpStatus.OK).json(search);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description:
      "You need to add UserId , will return the user's posts to you.",
  })
  @Get('searchByUser/:userId')
  async getPostsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Res() res: Response,
    @Query() query: FilterSearchDto,
  ) {
    try {
      const post = await this.postsService.getPostsByUserId(query, userId);

      return res.status(HttpStatus.OK).json(post);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description:
      'Add a post to the group . It is necessary to insert the group ID and post id into the body.',
  })
  @Post('react')
  @UseInterceptors(AuthMiddleware)
  async reactPost(
    @Res() res: Response,
    @Req() req: Request,
    @Body() body: ReactPostDto,
  ) {
    try {
      const data = await this.postsService.reactPost(body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'To get Reactions list mention reaction Id , or to get all mention -1 as reaction Id',
  })
  @Get('reactionsList')
  @UseInterceptors(AuthMiddleware)
  async getReactionsList(
    @Query() query: GetReactionsList,
    @Res() res: Response,
  ) {
    try {
      const data = await this.postsService.getReactionsList(query);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'To get post comments mention post Id !',
  })
  @Get('comments')
  @UseInterceptors(AuthMiddleware)
  async getComments(
    @Query() query: GetCommentsDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.postsService.getComments(query, req.body);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'To get comment replies mention Comment parent Id !',
  })
  @Get('replies')
  @UseInterceptors(AuthMiddleware)
  async getReplies(
    @Query() query: GetRepliesDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const data = await this.postsService.getReplies(query, req.body);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      throw error;
    }
  }

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

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Find posts by ID.',
  })
  @Get(':id')
  @UseInterceptors(AuthMiddleware)
  async getPost(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const post = await this.postsService.getPostById(id, req.body);

      return res.status(HttpStatus.OK).json(post);
    } catch (error) {
      throw error;
    }
  }
}
