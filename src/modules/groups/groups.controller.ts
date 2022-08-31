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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CreateGroupDto } from './dto/create.group.dto';
import { GroupsService } from './groups.service';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @UsePipes(new ValidationPipe())
  @ApiBearerAuth()
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
  @Delete(':id')
  async deleteGroup(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
    } catch (error) {
      throw error;
    }
  }
}
