import {
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
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { FilterSearchDto } from '../posts/dto/filter.search.dto';
import { TagsService } from './tags.service';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get all tags .',
  })
  @Get('/')
  async getTags(
    @Query() query: FilterSearchDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const tags = await this.tagsService.gettags(query, req);

      res.status(HttpStatus.OK).json(tags);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'This can only be done with a personal token, which only the admin has.',
  })
  @ApiBearerAuth()
  @Post('addDefaultTag')
  async addDefaultTags(@Res() res: Response, @Req() req: any) {
    try {
      const adding = await this.tagsService.addDefaultTag(req);
      return res.status(HttpStatus.CREATED).json(adding);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description:
      'This can only be done with a personal token, which only the admin has.',
  })
  @ApiBearerAuth()
  @Delete('deleteTagById/:id')
  async deleteTagById(
    @Res() res: Response,
    @Req() req: any,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const deleted = await this.tagsService.deleteTagById(id, req);
      return res.status(HttpStatus.NO_CONTENT).json(deleted);
    } catch (error) {
      throw error;
    }
  }
}
