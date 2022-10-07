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
import { FilterSearchDto } from './dto/filter.search.dto';
import { FavoritsEntityBase } from './entity/favorite.post.entity';
import { PostsEntityBase } from './entity/posts.entity';
import { TagsService } from '../tags/tags.service';
import { UploadFileEntityBase } from './upload_file/entity/upload_file.entity';
import { UploadFileService } from './upload_file/upload_file.service';
import { TagsPostEntityBase } from '../tags/entity/tags.for.posts.entity';
import { TagsNameEntityBase } from '../tags/entity/tags.name.entity';
import { AddToGroupDto } from './dto/add.to.group.dto';
import { GroupsEntityBase } from '../groups/entity/groups.entity';
import { PostsToGroupEntityBase } from './entity/group.post.entity';
import { PagedSearchDto } from 'src/shared/search/paged.search.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntityBase)
    private postsRepository: Repository<PostsEntityBase>,
    @InjectRepository(GroupsEntityBase)
    private groupsRepository: Repository<GroupsEntityBase>,
    @InjectRepository(TagsPostEntityBase)
    private tagsPostRepository: Repository<TagsPostEntityBase>,
    @InjectRepository(TagsNameEntityBase)
    private tagsNameRepository: Repository<TagsNameEntityBase>,
    @InjectRepository(UploadFileEntityBase)
    private uploadFileRepository: Repository<UploadFileEntityBase>,
    @InjectRepository(FavoritsEntityBase)
    private favoritesRepository: Repository<FavoritsEntityBase>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly uploadFileService: UploadFileService,
    private readonly tagsService: TagsService,
    @Inject(forwardRef(() => CategoriesForFavoriteService))
    private readonly categoriesForFavoritesService: CategoriesForFavoriteService,
    @InjectRepository(PostsToGroupEntityBase)
    private postToGroupRepository: Repository<PostsToGroupEntityBase>,
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
      if (data.tags === null) {
        throw new BadRequestException('Tags cannot be null!!!');
      }
      if (data.tags.length <= 5 && data.tags.length >= 3) {
        await this.postsRepository.save(newPost);
        await this.tagsService.addTagsForPost({
          postId: newPost.id,
          name: data.tags,
        });
      } else {
        throw new BadRequestException(
          'Tags length is not defined!!!',
          ' Must have at least 3 tags!!!',
        );
      }
      if (data.attachment) {
        await this.uploadFileService.uploadFilePath({
          postId: newPost.id,
          path: data.attachment,
        });
      }
      return { data: newPost, error: false, message: 'Its your new post.' };
    } catch (error) {
      Logger.log('error=> create post function', error);
      throw error;
    }
  }

  // delete post
  async deletePost(id: number, request: any) {
    try {
      const user = await this.authService.verifyToken(request);
      const post = await this.postsRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.userId', 'userEntity')
        .where({ id })
        .getOne();
      if (!post) {
        Logger.log('Post not exist!!!');
        throw new NotFoundException('Post not exist!');
      }

      if (post.userId['id'] !== user.id) {
        Logger.log('User not authorization!!!');
        throw new UnauthorizedException('User not authorization');
      }
      if (await this.uploadFileService.getFilePathById(post.id)) {
        await this.uploadFileService.deleteAllUploadFilePathPost(post.id);
      }
      await this.postsRepository.delete(id);
      return {
        data: null,
        error: false,
        message: `delete post when Id = ${id}`,
      };
    } catch (error) {
      Logger.log('error=> delete post function', error);
      throw error;
    }
  }

  async getPosts(query: PagedSearchDto) {
    try {
      const posts = await this.postsRepository
        .createQueryBuilder('posts')
        .leftJoinAndSelect('posts.uploadFileEntity', 'upload_fileId')
        .leftJoinAndSelect('upload_fileId.postId', 'uploadFile')
        .leftJoinAndSelect('posts.tagsEntity', 'tagsId')
        .leftJoinAndSelect('tagsId.tag', 'tagsName')
        .limit(query.limit)
        .offset(query.offset)
        .orderBy('posts.createdAt', 'DESC')
        .getMany();
      if (!posts[0]) {
        throw new BadRequestException("Don't get posts!!!");
      }
      return { data: posts, error: false, message: 'Get posts.' };
    } catch (error) {
      Logger.log('error=> get posts function ', error);
      throw error;
    }
  }

  async getPostById(id: number) {
    try {
      const post = await this.postsRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.uploadFileEntity', 'upload_fileId')
        .leftJoinAndSelect('upload_fileId.postId', 'uploadFile')
        .leftJoinAndSelect('post.tagsEntity', 'tagsId')
        .leftJoinAndSelect('tagsId.tag', 'tagsName')
        // .andWhere('upload_fileId.postId = :id', { id })
        // .andWhere('tagsId.post = :id', { id })
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

  async addPostToGroup(data: AddToGroupDto, request: any) {
    try {
      const user = await this.authService.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User not authorization!!!');
      }

      const group = await this.groupsRepository.findOne({
        where: { id: data.groupId },
      });
      if (!group) {
        throw new NotFoundException('The group is not found!!!');
      }
      const post = await this.postsRepository.findOne({
        where: { id: data.postId },
      });
      if (!post) {
        throw new NotFoundException('The post is not found!!!');
      }
      if (post.userId !== user.id) {
        throw new UnauthorizedException('User is not authorized!!!');
      }
      const postToGroup = await this.postToGroupRepository.save(
        this.postToGroupRepository.create({
          postId: data.postId,
          groupId: data.groupId,
        }),
      );
      return {
        data: postToGroup,
        error: false,
        message: 'Post add to group.',
      };
    } catch (error) {
      Logger.log('error=> add post to group function ', error);
      throw error;
    }
  }

  //search posts by title
  async searchByTitlePost(query: FilterSearchDto, request: any) {
    try {
      // const user = await this.authService.verifyToken(request);
      // if (!user) {
      //   throw new UnauthorizedException('User not authorization!!!');
      // }

      const [result, count] = await this.postsRepository
        .createQueryBuilder('posts')
        .limit(query.limit)
        .offset(query.offset)
        .orderBy('posts.createdAt', 'DESC')
        .where(`lower("posts"."title") LIKE lower('${query.beginning || ''}%')`)
        .getManyAndCount();
      return {
        data: { result, count },
        error: false,
        message: 'this is a posts',
      };
    } catch (error) {
      Logger.log('error=> search post function ', error);
      throw error;
    }
  }

  // // search posts by tags
  async searchByTagsPost(query: FilterSearchDto, request: any) {
    try {
      // const user = await this.authService.verifyToken(request);
      // if (!user) {
      //   throw new UnauthorizedException('User not authorization!!!');
      // }

      const [result, count] = await this.tagsPostRepository
        .createQueryBuilder('tags')
        .leftJoinAndSelect('tags.post', 'postId')
        .leftJoinAndSelect('tags.tag', 'tagEntity')
        .limit(query.limit)
        .offset(query.offset)
        .orderBy('tags.createdAt', 'DESC')
        .where(
          `lower("tagEntity"."name") LIKE lower('${query.beginning || ''}%')`,
        )
        .getManyAndCount();
      return {
        data: { result, count },
        error: false,
        message: 'this is a posts',
      };
    } catch (error) {
      Logger.log('error=> search post function ', error);
      throw error;
    }
  }

  // search posts by attachments
  async searchByAttachmentsPost(query: FilterSearchDto, request: any) {
    try {
      // const user = await this.authService.verifyToken(request);
      // if (!user) {
      //   throw new UnauthorizedException('User not authorization!!!');
      // }

      const [result, count] = await this.uploadFileRepository
        .createQueryBuilder('file')
        .leftJoinAndSelect('file.postId', 'postId')
        .limit(query.limit)
        .offset(query.offset)
        .orderBy('file.createdAt', 'DESC')
        .where(`lower("file"."path") LIKE lower('${query.beginning || ''}%')`)
        .getManyAndCount();
      return {
        data: { result: result, count },
        error: false,
        message: 'this is a posts',
      };
    } catch (error) {
      Logger.log('error=> search post function ', error);
      throw error;
    }
  }

  async getSamePosts(query: PagedSearchDto, postId: number) {
    try {
      const post = await this.postsRepository
        .createQueryBuilder('post')
        .innerJoinAndSelect('post.tagsEntity', 'tags')
        .leftJoinAndSelect('tags.tag', 'tagName')
        // .select('post')
        // .addSelect(['tags.tag.', 'tagName.name'])
        .where({ id: postId })
        .getOne();
      if (!post) {
        throw new NotFoundException('Post is not exist!!!');
      }
      const [result, count] = await this.tagsPostRepository
        .createQueryBuilder('tags')
        .leftJoinAndSelect('tags.post', 'postId')
        .leftJoinAndSelect('tags.tag', 'tagEntity')
        .limit(query.limit)
        .offset(query.offset)
        .orderBy('tags.createdAt', 'DESC')
        .where(
          `lower("tagEntity"."name") LIKE lower('${
            post.tagsEntity[0].tag['name'] || post.tagsEntity[1].tag['name']
          }%')`,
        )
        .getManyAndCount();
      return { data: result, error: false, message: 'get same post.' };
    } catch (error) {
      Logger.log('get same posts function ', error);
      throw error;
    }
  }
}
