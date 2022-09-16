import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import { UserFollowEntitiyBase } from '../entity/user.following.entity';
import { ReactionsEntityBase } from '../entity/reactions.entity';
import { PostsEntityBase } from 'src/modules/posts/entity/posts.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserFollowEntitiyBase)
    private userFollowRepository: Repository<UserFollowEntitiyBase>,
    @InjectRepository(ReactionsEntityBase)
    private reactionsRepository: Repository<ReactionsEntityBase>,
    @InjectRepository(PostsEntityBase)
    private postsRepository: Repository<PostsEntityBase>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  // Get Followers Count
  async getFollowersCount(req: any, body: any) {
    try {
      const userId = body.id;
      const userAuth = await this.authService.verifyToken(req);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const followersCount = await this.userFollowRepository
        .createQueryBuilder()
        .where('following_to_id = :id', { id: userId })
        .getCount();

      return {
        data: {
          user: followersCount,
        },
      };
    } catch (error) {
      Logger.log("error=> Can't get followers count", error);
      throw error;
    }
  }

  async getFollowingsCount(req: any, body: any) {
    try {
      const userId = body.id;
      const userAuth = await this.authService.verifyToken(req);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const followingsCount = await this.userFollowRepository
        .createQueryBuilder()
        .where('user_id = :id', { id: userId })
        .getCount();

      return {
        data: {
          user: followingsCount,
        },
      };
    } catch (error) {
      Logger.log("error=> Can't get followings count", error);
      throw error;
    }
  }

  async getLikedDislikedPostsCount(req: any, body: any, param: any) {
    try {
      const userId = body;
      const reaction = param;
      const userAuth = await this.authService.verifyToken(req);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const likedPostsCount = await this.reactionsRepository
        .createQueryBuilder()
        .where(`user_id = ${userId} && reaction_type = ${reaction}`)
        .getCount();

      return {
        data: {
          user: likedPostsCount,
        },
      };
    } catch (error) {
      Logger.log("error=> Can't get liked & disliked posts count", error);
      throw error;
    }
  }

  async getFollowers(req: any, body: any) {
    try {
      const userId = body.id;
      const userAuth = await this.authService.verifyToken(req);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const followers = await this.userFollowRepository.find({
        where: { followToId: userId },
      });

      return {
        data: {
          user: followers,
        },
      };
    } catch (error) {
      Logger.log("error=> Can't get disliked posts count", error);
      throw error;
    }
  }

  async getFollowings(req: any, body: any) {
    try {
      const userId = body.id;
      const userAuth = await this.authService.verifyToken(req);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const followings = await this.userFollowRepository.find({
        where: { userId: userId },
      });

      return {
        data: {
          user: followings,
        },
      };
    } catch (error) {
      Logger.log("error=> Can't get disliked posts count", error);
      throw error;
    }
  }

  async getCreatedPostsCount(req: any, body: any) {
    try {
      const userId = body.id;
      const userAuth = await this.authService.verifyToken(req);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const createdPostsCount = await this.postsRepository
        .createQueryBuilder()
        .where(`user_id = ${userId}`)
        .getCount();

      return {
        data: {
          user: createdPostsCount,
        },
      };
    } catch (error) {
      Logger.log("error=> Can't get created posts", error);
      throw error;
    }
  }

  async getCreatedPosts(req: any, body: any) {
    try {
      const userId = body.id;
      const userAuth = await this.authService.verifyToken(req);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const createdPosts = await this.userFollowRepository.find({
        where: { userId },
      });

      return {
        data: {
          user: createdPosts,
        },
      };
    } catch (error) {
      Logger.log("error=> Can't get created posts", error);
      throw error;
    }
  }
}
