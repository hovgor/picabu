import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { CreateCategorieForFavoritesDto } from './dto/create.categorie.for.favorites.dto';
import { CategorieForFavoritsEntityBase } from './entity/categorie.for.favorits.entity';

@Injectable()
export class CategoriesForFavoriteService {
  constructor(
    @InjectRepository(CategorieForFavoritsEntityBase)
    private categorieForFavoritsRepository: Repository<CategorieForFavoritsEntityBase>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async createCategorieForFavoritWhitSignUp(id: number) {
    try {
      const newCategorieForFavorits =
        await this.categorieForFavoritsRepository.save(
          this.categorieForFavoritsRepository.create({
            title: 'Default',
            user: id,
          }),
        );
      return newCategorieForFavorits;
    } catch (error) {
      Logger.log(
        'error=> create categories for favorits whit sign up function ',
        error,
      );
      throw error;
    }
  }

  async createCategorieForFavorits(
    data: CreateCategorieForFavoritesDto,
    request: any,
  ) {
    try {
      const user = await this.authService.verifyToken(request);
      const categorieForFavorites =
        await this.categorieForFavoritsRepository.save(
          this.categorieForFavoritsRepository.create({
            title: data.title,
            user: user.id,
          }),
        );
      return {
        data: categorieForFavorites,
        error: false,
        message: `Create new categories for favorites , user ${user.id}`,
      };
    } catch (error) {
      Logger.log('error=> create categories for favorits function ', error);
      throw error;
    }
  }

  async deleteCategoriesForFavoritesById(id: number, request: any) {
    try {
      const user = await this.authService.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User not authorized!!!');
      }

      const categories = await this.categorieForFavoritsRepository.findOne({
        where: { id },
      });
      if (!categories) {
        Logger.log('Categories not exist!!!');
        throw new NotFoundException('Categories not exist!');
      }

      if (categories.user !== user.id) {
        Logger.log('User not authorization!!!');
        throw new UnauthorizedException('User not authorization');
      }
      if (categories.title === 'Default') {
        Logger.log("Can't delete default category!!!");
        throw new BadRequestException("Can't delete default category!!!");
      }

      return await this.categorieForFavoritsRepository.delete(id);
    } catch (error) {
      Logger.log(
        'error=> delete Categories for favorites by id function ',
        error,
      );
      throw error;
    }
  }

  async updateCategoriesForFavorites(
    data: CreateCategorieForFavoritesDto,
    request: any,
    id: number,
  ) {
    try {
      const user = await this.authService.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User not authorized!!!');
      }

      const categories = await this.categorieForFavoritsRepository.findOne({
        where: { id },
      });
      if (!categories) {
        Logger.log('Categories not exist!!!');
        throw new NotFoundException('Categories not exist!');
      }
      if (categories.title === 'Default') {
        Logger.log("Can't edit default category!!!");
        throw new BadRequestException("Can't edit default category!!!");
      }
      if (categories.user !== user.id) {
        Logger.log('User not authorization!!!');
        throw new UnauthorizedException('User not authorization!!!');
      }
      await this.categorieForFavoritsRepository.update({ id }, data);

      return {
        data: null,
        error: false,
        message: `update categories N/ ${categories.id}.`,
      };
    } catch (error) {
      Logger.log('error => Update Categories function ', error);
      throw error;
    }
  }

  async getAllCategories(request: any) {
    try {
      const user = await this.authService.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const categories = await this.categorieForFavoritsRepository.find({
        where: { user: user.id },
      });
      return {
        data: categories,
        error: false,
        message: 'all categories',
      };
    } catch (error) {
      Logger.log('error => get all Categories function ', error);
      throw error;
    }
  }
}
