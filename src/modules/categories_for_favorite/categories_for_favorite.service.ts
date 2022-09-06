import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
import { FavoritsEntityBase } from '../posts/entity/favorite.post.entity';
import { PostsEntityBase } from '../posts/entity/posts.entity';
import { UsersEntityBase } from '../users/entity/users.entity';
import { CreateCategorieForFavoritesDto } from './dto/create.categorie.for.favorites.dto';
import { DeletePostFromCategorieDto } from './dto/delete.post.from.categorie.dto';
import { CategorieForFavoritsEntityBase } from './entity/categorie.for.favorits.entity';

@Injectable()
export class CategoriesForFavoriteService {
  constructor(
    @InjectRepository(CategorieForFavoritsEntityBase)
    private categorieForFavoritsRepository: Repository<CategorieForFavoritsEntityBase>,
    @InjectRepository(PostsEntityBase)
    private postsRepository: Repository<PostsEntityBase>,
    @InjectRepository(FavoritsEntityBase)
    private favoritesRepository: Repository<FavoritsEntityBase>,
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
      const validCategories = await this.categorieForFavoritsRepository.findOne(
        { where: { title: data.title } },
      );
      if (validCategories) {
        throw new BadRequestException('Categories title is exist!!!');
      }
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
        throw new BadRequestException("Can't delete Default category!!!");
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

  async getCategoriesById(id: number) {
    try {
      return await this.categorieForFavoritsRepository.findOne({
        where: { id },
      });
    } catch (error) {
      Logger.log('error => get categories by id function ', error);
      throw error;
    }
  }

  async getCategories(id: number, request: any) {
    try {
      const user: UsersEntityBase = await this.authService.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User not authorized!!!');
      }

      const categorieFavorite = await this.categorieForFavoritsRepository
        .createQueryBuilder('categorie')
        .leftJoinAndSelect('categorie.categoriesEntity', 'favoritesId')
        .where('favoritesId.categoriesId = :id', { id })
        .getMany();

      if (categorieFavorite[0].user !== user.id) {
        throw new UnauthorizedException('User not authorized!!!');
      }

      const arr = [];

      for (let i = 0; i < categorieFavorite[0].categoriesEntity.length; ++i) {
        const post = await this.postsRepository
          .createQueryBuilder('post')
          .leftJoinAndSelect('post.uploadFileEntity', 'upload_fileId')
          .leftJoinAndSelect('post.tagsEntity', 'tagsId')
          .andWhere('upload_fileId.postId = :id', {
            id: categorieFavorite[0].categoriesEntity[i].postId,
          })
          .andWhere('tagsId.postId = :id', {
            id: categorieFavorite[0].categoriesEntity[i].postId,
          })
          .where('post.id = :id', { i })
          .getOne();
        arr.push(post);
      }
      return { data: arr, error: false, message: 'This is your categorie.' };
    } catch (error) {
      Logger.log('error=> get categories for favorites function ', error);
      throw error;
    }
  }

  async deletePostFromCategorie(
    data: DeletePostFromCategorieDto,
    request: any,
  ) {
    try {
      const user: UsersEntityBase = await this.authService.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const validCategories = await this.categorieForFavoritsRepository.findOne(
        { where: { id: data.categorieId } },
      );
      if (!validCategories && validCategories.user !== user.id) {
        throw new ForbiddenException('Access is denied!!!');
      }
      const categorieFavorite = await this.categorieForFavoritsRepository
        .createQueryBuilder('categorie')
        .leftJoinAndSelect('categorie.categoriesEntity', 'favoritesId')
        .where('favoritesId.categoriesId = :id', { id: data.categorieId })
        .getOne();
      if (!categorieFavorite) {
        throw new UnprocessableEntityException('Something went wrong!!!');
      }
      if (categorieFavorite.user !== user.id) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      let id: number;
      for (let i = 0; i < categorieFavorite.categoriesEntity.length; ++i) {
        if (categorieFavorite.categoriesEntity[i].postId === data.postId) {
          id = categorieFavorite.categoriesEntity[i].id;
          break;
        }
      }
      if (!id) {
        throw new BadRequestException('Post is not defined!!!');
      }

      await this.favoritesRepository.delete(id);

      return {
        data: null,
        error: false,
        message: 'favorite post in categorie is deleted',
      };
    } catch (error) {
      Logger.log('error=> delete post from categorie function ', error);
      throw error;
    }
  }
}
