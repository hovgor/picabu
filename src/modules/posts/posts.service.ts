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
import { CategoriesForFavoriteService } from '../categories_for_favorite/categories_for_favorite.service';
import { CreatePostBodyDto } from './dto/create.post.body.dto';
import { FavoritsEntityBase } from './entity/favorite.post.entity';
import { PostsEntityBase } from './entity/posts.entity';
import { TegsService } from './tegs/tegs.service';
import { UploadFileService } from './upload_file/upload_file.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntityBase)
    private postsRepository: Repository<PostsEntityBase>,
    @InjectRepository(FavoritsEntityBase)
    private favoritesRepository: Repository<FavoritsEntityBase>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly uploadFileService: UploadFileService,
    private readonly tagsService: TegsService,
    @Inject(forwardRef(() => CategoriesForFavoriteService))
    private readonly categoriesForFavoritesService: CategoriesForFavoriteService,
  ) {}

  // create post
  async createPost(data: CreatePostBodyDto, request: any) {
    try {
      const user = await this.authService.verifyToken(request);
      const newPost = this.postsRepository.create({
        title: data.title,
        description: data.description,
        userId: user.id,
      });

      if (data.tags.length <= 5 && data.tags.length >= 3) {
        await this.postsRepository.save(newPost);
        await this.tagsService.addTags({ postId: newPost.id, name: data.tags });
      } else {
        throw new BadRequestException('Tags length is not defined!!!');
      }
      if (data.attachment) {
        await this.uploadFileService.uploadFilePath({
          postId: newPost.id,
          path: data.attachment,
        });
      }
      return newPost;
    } catch (error) {
      Logger.log('error=> create post function', error);
      throw error;
    }
  }

  // delete post
  async deletePost(id: number, request: any) {
    try {
      const user = await this.authService.verifyToken(request);
      const post = await this.postsRepository.findOne({ where: { id } });
      if (!post) {
        Logger.log('Post not exist!!!');
        throw new NotFoundException('Post not exist!');
      }

      if (post.userId !== user.id) {
        Logger.log('User not authorization!!!');
        throw new UnauthorizedException('User not authorization');
      }
      if (await this.uploadFileService.getFilePathById(post.id)) {
        await this.uploadFileService.deleteAllUploadFilePathPost(post.id);
      }
      await this.postsRepository.delete(id);
      return {
        data: null,
        message: `delete post when Id = ${id}`,
        error: false,
      };
    } catch (error) {
      Logger.log('error=> delete post function', error);
      throw error;
    }
  }

  async getPostById(id: number) {
    try {
      const post = await this.postsRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.uploadFileEntity', 'upload_fileId')
        .leftJoinAndSelect('post.tagsEntity', 'tegsId')
        .andWhere('upload_fileId.postId = :id', { id })
        .andWhere('tegsId.postId = :id', { id })
        .where('post.id = :id', { id })
        .getOne();
      if (!post) {
        throw new NotFoundException('Post not exist!!!');
      }
      return {
        data: post,
        error: false,
        message: `get post ${post.title}`,
      };
    } catch (error) {
      Logger.log('error=> get post function ', error);
      throw error;
    }
  }

  async addPostToFavorites(categoriesId: number, postId: number, request: any) {
    try {
      const user = await this.authService.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User not authorization!!!');
      }

      const categories =
        await this.categoriesForFavoritesService.getCategoriesById(
          categoriesId,
        );
      if (!categories) {
        throw new NotFoundException('Categories not exist!!!');
      }
      if (categories.user !== user.id) {
        throw new NotFoundException('User does not have such category!!!');
      }
      const post = await this.postsRepository.findOne({
        where: { id: postId },
      });
      if (!post) {
        Logger.log('post is not defined');
      }

      const favoritPost: FavoritsEntityBase =
        await this.favoritesRepository.save(
          this.favoritesRepository.create({
            categoriesId: categoriesId,
            postId: postId,
          }),
        );

      return {
        data: favoritPost,
        error: false,
        message: 'favorite post create',
      };
    } catch (error) {
      Logger.log('error=> add post to favorites function ', error);
      throw error;
    }
  }
}
