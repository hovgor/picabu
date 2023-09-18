import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateGroupDto } from './dto/create.group.dto';
import { GroupsService } from './groups.service';
import { EditCommunityDto } from './dto/edit.commuity.dto';
import { AuthMiddleware } from 'src/shared/middlewares/auth.middleware';
import { CommunitiesTargets } from 'src/shared/types/communities.target';
import { CommunitiesTargetsDto } from './dto/get.communities.dto';
import { NewOrTop } from 'src/shared/types/NewOrTop';
import { GetGroupPostsDto } from './dto/get_group_posts.dto';

@ApiTags('Communities')
@Controller('communities')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Create groups. to create a group, URL header fields and tags are required, there must be at least three tags, not necessarily nested.',
  })
  @Post('/create')
  @UseInterceptors(AuthMiddleware)
  async createGroup(
    @Res() res: Response,
    @Req() req: any,
    @Body() body: CreateGroupDto,
  ) {
    try {
      const newGroup = await this.groupsService.createGroup(body);
      return res.status(HttpStatus.CREATED).json(newGroup);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Update Community by ID. ID most be a number.',
  })
  @Put('/edit')
  async editCommunity(
    @Res() res: Response,
    @Req() req: any,
    @Body() body: EditCommunityDto,
  ) {
    try {
      const editCommunity = await this.groupsService.editCommunity(body, req);
      return res.status(HttpStatus.NO_CONTENT).json(editCommunity);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete Community by ID. ID most be a number.',
  })
  @Delete(':id')
  async deleteGroup(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const deleteGroup = await this.groupsService.deleteGroup(id, req);
      return res.status(HttpStatus.NO_CONTENT).json(deleteGroup);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get community!',
  })
  @Get('/community')
  @UseInterceptors(AuthMiddleware)
  async getGroup(
    @Query('communityId') communityId: number,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const groups = await this.groupsService.getGroup(
        communityId,
        req.body.userId,
      );
      res.status(HttpStatus.OK).json(groups);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get communities!',
  })
  @Get('/allCommunities')
  @ApiQuery({ name: 'target', enum: CommunitiesTargets })
  @UseInterceptors(AuthMiddleware)
  async getGroups(
    @Req() req: any,
    @Res() res: Response,
    @Query() query: CommunitiesTargetsDto,
  ) {
    try {
      const groups = await this.groupsService.getGroups(query, req.body);
      res.status(HttpStatus.OK).json(groups);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get communitie posts!',
  })
  @Get('/communitiePosts')
  @ApiQuery({ name: 'status', enum: NewOrTop })
  @UseInterceptors(AuthMiddleware)
  async getGroupPosts(
    @Req() req: any,
    @Res() res: Response,
    @Query() query: GetGroupPostsDto,
  ) {
    try {
      const groups = await this.groupsService.getGroupPosts2(query, req);
      return res.status(HttpStatus.OK).json(groups);
    } catch (error) {
      throw error;
    }
  }
}
