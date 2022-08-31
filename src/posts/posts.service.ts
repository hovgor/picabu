import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { CreatePostBodyDto } from './dto/create.post.body.dto';
import { PostsEntityBase } from './entity/posts.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntityBase)
    private postsRepository: Repository<PostsEntityBase>,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async createPost(data: CreatePostBodyDto, request: any) {
    try {
      const token = (request.headers['authorization'] + '').split(' ')[1];
      const verifyToken = await this.authService.verifyToken(token);
    } catch (error) {
      Logger.log('error=> create post function', error);
      throw error;
    }
  }
}
