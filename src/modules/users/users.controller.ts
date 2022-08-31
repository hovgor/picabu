import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ReactionsDto } from './dto/reactions.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    try {
      const user = await this.usersService.getUserById(id);
      res.status(HttpStatus.OK).json(user);
    } catch (error) {
      throw error;
    }
  }

  @Post('/reactUnreactPost')
  async reactUnreactPost(@Body() body: ReactionsDto) {
    try {
      const data = await this.usersService.reactPost(body);
    } catch (error) {
      throw error;
    }
  }
}
