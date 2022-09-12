import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateGroupDto } from './dto/create.group.dto';
import { GroupsService } from './groups.service';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Create groups. to create a group, URL header fields and tags are required, there must be at least three tags, not necessarily nested.',
  })
  @Post('/')
  async createGroup(
    @Res() res: Response,
    @Req() req: any,
    @Body() body: CreateGroupDto,
  ) {
    try {
      const newGroup = await this.groupsService.createGroup(body, req);
      return res.status(HttpStatus.CREATED).json(newGroup);
    } catch (error) {
      throw error;
    }
  }
  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete group by ID. ID most be a number.',
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
}
