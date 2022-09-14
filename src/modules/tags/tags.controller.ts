import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Req,
  Res,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { FilterSearchDto } from '../posts/dto/filter.search.dto';
import { AddTagDto } from './dto/add.tag.dto';
import { TagsService } from './tags.service';

@ApiTags('Tags')
@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @UsePipes(new ValidationPipe())
  @Post('addTag')
  async addTag(@Body() body: AddTagDto, @Res() res: Response) {
    try {
      const adding = await this.tagsService.addTag(body);
      return res.status(HttpStatus.CREATED).json(adding);
    } catch (error) {
      throw error;
    }
  }

  // @UsePipes(new ValidationPipe())
  // @Post('addDefaultTag')
  // async addDefaultTags(@Res() res: Response) {
  //   try {
  //     const adding = await this.tagsService.addDefaultTags();
  //     return res.status(HttpStatus.CREATED).json(adding);
  //   } catch (error) {
  //     throw error;
  //   }
  // }
  @ApiBearerAuth()
  @Get('tags')
  async getTags(
    @Query() query: FilterSearchDto,
    @Res() res: Response,
    @Req() req: any,
  ) {
    try {
      const tags = await this.tagsService.gettags(query, req);

      res.status(HttpStatus.ACCEPTED).json(tags);
    } catch (error) {
      throw error;
    }
  }
}
