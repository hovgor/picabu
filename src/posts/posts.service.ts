import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreatePostBodyDto } from './dto/create.post.body.dto';
import { PostsEntityBase } from './entity/posts.entity';
import { TegsService } from './tegs/tegs.service';
import { UploadFileService } from './upload_file/upload_file.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntityBase)
    private postsRepository: Repository<PostsEntityBase>,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly uploadFileService: UploadFileService,
    private readonly tagsService: TegsService,
  ) {}

  // create post
  async createPost(data: CreatePostBodyDto, request: any) {
    try {
      const token = (request.headers['authorization'] + '').split(' ')[1];
      const verifyToken = await this.authService.verifyToken(token);
      const newPost = await this.postsRepository.save(
        this.postsRepository.create({
          title: data.title,
          description: data.description,
          userId: verifyToken.id,
        }),
      );
      if (data.attachment) {
        await this.uploadFileService.uploadFilePath({
          postId: newPost.id,
          path: data.attachment,
        });
      }
      if (data.tags) {
        await this.tagsService.addTags({ postId: newPost.id, name: data.tags });
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
      const token = (request.headers['authorization'] + '').split(' ')[1];
      const user = await this.authService.verifyToken(token);
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
}
