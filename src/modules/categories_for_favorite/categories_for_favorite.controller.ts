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
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CategoriesForFavoriteService } from './categories_for_favorite.service';
import { CreateCategorieForFavoritesDto } from './dto/create.categorie.for.favorites.dto';

@ApiTags('Categories-for-favorite')
@Controller('categories-for-favorite')
export class CategoriesForFavoriteController {
  constructor(
    private readonly categoriesForFavoriteService: CategoriesForFavoriteService,
  ) {}

  @ApiBearerAuth()
  @Post('/')
  async createCategoriesForFavorites(
    @Res() res: Response,
    @Req() req,
    @Body() body: CreateCategorieForFavoritesDto,
  ) {
    try {
      const newCategorieForFavorits =
        await this.categoriesForFavoriteService.createCategorieForFavorits(
          body,
          req,
        );
      res.status(HttpStatus.CREATED).json(newCategorieForFavorits);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Delete(':id')
  async deleteCategoriesForFavoritesById(
    @Res() res: Response,
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const categoriesDelete =
        await this.categoriesForFavoriteService.deleteCategoriesForFavoritesById(
          id,
          req,
        );
      return res.status(HttpStatus.NO_CONTENT).json(categoriesDelete);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Put(':id')
  async updateCategories(
    @Res() res: Response,
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateCategorieForFavoritesDto,
  ) {
    try {
      const updateCategorie =
        await this.categoriesForFavoriteService.updateCategoriesForFavorites(
          body,
          req,
          id,
        );
      return res.status(HttpStatus.OK).json(updateCategorie);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @Get('all')
  async getAllCategories(@Res() res: Response, @Req() req) {
    try {
      const allCategories =
        await this.categoriesForFavoriteService.getAllCategories(req);
      return res.status(HttpStatus.OK).json(allCategories);
    } catch (error) {
      throw error;
    }
  }
}
