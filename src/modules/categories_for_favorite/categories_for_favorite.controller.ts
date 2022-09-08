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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CategoriesForFavoriteService } from './categories_for_favorite.service';
import { CreateCategorieForFavoritesDto } from './dto/create.categorie.for.favorites.dto';

@ApiTags('CategoriesForFavorite')
@Controller('categoriesForFavorite')
export class CategoriesForFavoriteController {
  constructor(
    private readonly categoriesForFavoriteService: CategoriesForFavoriteService,
  ) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Create categories for favorite posts. Categories name must be a string.',
  })
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
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete categorie by ID. ID most be a number.',
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Update categorie by ID. You need to put the ID and name of the category.',
  })
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Find all categories.',
  })
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
  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Find categorie by ID. ID most be a number.',
  })
  @Get(':id')
  async getCategories(
    @Res() res: Response,
    @Req() req,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const categorieFavorite =
        await this.categoriesForFavoriteService.getCategories(id, req);
      return res.status(HttpStatus.OK).json(categorieFavorite);
    } catch (error) {
      throw error;
    }
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description:
      'Delete posts in categories. You need to put the category ID and the post ID to remove the post from the category.',
  })
  @Delete(':categorieId/:postId')
  async deletePostfromCategorie(
    @Res() res: Response,
    @Req() req,
    @Param('categorieId', ParseIntPipe) categorieId: number,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    try {
      const categorieFavorite =
        await this.categoriesForFavoriteService.deletePostFromCategorie(
          { categorieId, postId },
          req,
        );
      return res.status(HttpStatus.NO_CONTENT).json(categorieFavorite);
    } catch (error) {
      throw error;
    }
  }
}
