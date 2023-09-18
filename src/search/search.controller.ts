import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Query,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { FilterSearchDto } from 'src/modules/posts/dto/filter.search.dto';
import { Request, Response } from 'express';
import { AuthMiddleware } from 'src/shared/middlewares/auth.middleware';
import { CommunitiesTargetsDto } from 'src/modules/groups/dto/get.communities.dto';
import { CommunitiesTargets } from 'src/shared/types/communities.target';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(
    @Inject(SearchService)
    private searchService: SearchService,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all posts .',
  })
  @UseInterceptors(AuthMiddleware)
  @Get('posts')
  async getPosts(
    @Res() res: Response,
    @Query() query: FilterSearchDto,
    @Req() req: Request,
  ) {
    try {
      const search = await this.searchService.searchByTitlePost(
        query,
        req.body,
      );
      return res.status(HttpStatus.OK).json(search);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all users .',
  })
  @UseInterceptors(AuthMiddleware)
  @Get('users')
  async getUsers(
    @Res() res: Response,
    @Query() query: FilterSearchDto,
    @Req() req: Request,
  ) {
    try {
      const search = await this.searchService.searchUsersByNickname(
        query,
        req.body,
      );
      return res.status(HttpStatus.OK).json(search);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all communities .',
  })
  @UseInterceptors(AuthMiddleware)
  @ApiQuery({ name: 'target', enum: CommunitiesTargets })
  @Get('communities')
  async getCommunites(
    @Res() res: Response,
    @Query() query: CommunitiesTargetsDto,
    @Req()
    req: Request,
  ) {
    try {
      const search = await this.searchService.searchGroups(query, req.body);
      return res.status(HttpStatus.OK).json(search);
    } catch (error) {
      throw error;
    }
  }
}
