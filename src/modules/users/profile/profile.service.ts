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
import { PagedSearchDto } from 'src/shared/search/paged.search.dto';
import { UsersEntityBase } from '../entity/users.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserFollowEntitiyBase)
    private userFollowRepository: Repository<UserFollowEntitiyBase>,
    @InjectRepository(UsersEntityBase)
    private usersRepository: Repository<UsersEntityBase>,
    @InjectRepository(ReactionsEntityBase)
    private reactionsRepository: Repository<ReactionsEntityBase>,
    @InjectRepository(PostsEntityBase)
    private postsRepository: Repository<PostsEntityBase>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  // Get Followers Count
  async getFollowersCount(req: any, query: PagedSearchDto) {
    try {
      const userAuth = await this.authService.verifyToken(req);

      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const followersCount = await this.userFollowRepository
        .createQueryBuilder('followers')
        .leftJoinAndSelect('followers.followToId', 'followerUsers')
        .limit(query.limit)
        .offset(query.offset)
        .orderBy('followers.createdAt', 'DESC')
        .where('followers.followToId = :id', { id: userAuth.id })
        .getCount();

      return {
        data: followersCount,
        error: false,
        message: 'Your followers count.',
      };
    } catch (error) {
      Logger.log("error=> Can't get followers count", error);
      throw error;
    }
  }

  async getFollowingsCount(req: any, query: PagedSearchDto) {
    try {
      const userAuth = await this.authService.verifyToken(req);

      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const followersCount = await this.userFollowRepository
        .createQueryBuilder('followings')
        .leftJoinAndSelect('followings.followToId', 'followingsUsers')
        .limit(query.limit)
        .offset(query.offset)
        .orderBy('followings.createdAt', 'DESC')
        .where('followings.userId = :id', { id: userAuth.id })
        .getCount();

      return {
        data: followersCount,
        error: false,
        message: 'Your followings count.',
      };
    } catch (error) {
      Logger.log("error=> Can't get followings count", error);
      throw error;
    }
  }

  async getLikedDislikedPostsCount(req: any, body: any) {
    try {
      const reaction = parseInt(body.reaction);
      const userAuth = await this.authService.verifyToken(req);
      const id = userAuth.id;
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const likedPostsCount = await this.reactionsRepository
        .createQueryBuilder()
        .where(`userId = ${id} AND reactionType = ${reaction}`)
        .getCount();

      return {
        data: {
          count: likedPostsCount,
        },
      };
    } catch (error) {
      Logger.log("error=> Can't get liked & disliked posts count", error);
      throw error;
    }
  }

  async getFollowers(req: any, query: PagedSearchDto) {
    try {
      const userAuth = await this.authService.verifyToken(req);

      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const followers: UserFollowEntitiyBase[] = await this.userFollowRepository
        .createQueryBuilder('followers')
        .leftJoinAndSelect('followers.userId', 'followUsers')
        .limit(query.limit)
        .offset(query.offset)
        .orderBy('followers.createdAt', 'DESC')
        .where('followers.followToId = :id', { id: userAuth.id })
        .select('followers')
        .addSelect([
          'followUsers.id',
          'followUsers.nicname',
          'followUsers.email',
          'followUsers.deviceId',
          'followUsers.providerId',
          'followUsers.profilePhotoUrl',
          'followUsers.provider',
          'followUsers.userType',
          'followUsers.role',
          'followUsers.phone',
          'followUsers.createdAt',
          'followUsers.updatedAt',
        ])
        .getMany();

      if (!followers[0]) {
        return {
          data: null,
          error: true,
          message: "You don't have a followers.",
        };
      }

      return {
        data: followers,
        error: false,
        message: 'Its your followers.',
      };
    } catch (error) {
      Logger.log("error=> Can't get followers function", error);
      throw error;
    }
  }

  async getFollowings(req: any, query: PagedSearchDto) {
    try {
      const userAuth = await this.authService.verifyToken(req);

      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const followings: UserFollowEntitiyBase[] =
        await this.userFollowRepository
          .createQueryBuilder('followings')
          .leftJoinAndSelect('followings.followToId', 'followingUsers')
          .limit(query.limit)
          .offset(query.offset)
          .orderBy('followings.createdAt', 'DESC')
          .where('followings.userId = :id', { id: userAuth.id })
          .select('followings')
          .addSelect([
            'followingUsers.id',
            'followingUsers.nicname',
            'followingUsers.email',
            'followingUsers.deviceId',
            'followingUsers.providerId',
            'followingUsers.profilePhotoUrl',
            'followingUsers.provider',
            'followingUsers.userType',
            'followingUsers.role',
            'followingUsers.phone',
            'followingUsers.createdAt',
            'followingUsers.updatedAt',
          ])
          .getMany();

      if (!followings[0]) {
        return {
          data: null,
          error: true,
          message: "You don't have a followings.",
        };
      }

      return {
        data: followings,
        error: false,
        message: 'Its your followings.',
      };
    } catch (error) {
      Logger.log("error=> Can't get followings function", error);
      throw error;
    }
  }

  async getCreatedPostsCount(req: any, body: any) {
    try {
      const userAuth = await this.authService.verifyToken(req);
      const id = userAuth.id;

      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const createdPostsCount = await this.postsRepository
        .createQueryBuilder()
        .where(`userId = ${id}`)
        .getCount();

      return {
        data: {
          createdPostsCount: createdPostsCount,
        },
      };
    } catch (error) {
      Logger.log("error=> Can't get created posts", error);
      throw error;
    }
  }

  async getCreatedPosts(req: any, body: any) {
    try {
      const userAuth = await this.authService.verifyToken(req);
      const id = userAuth.id;

      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const createdPosts = await this.userFollowRepository.find({
        where: { id },
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

  async getReactedPosts(req: any, body: any) {
    try {
      const reaction = body.reaction;

      const userAuth = await this.authService.verifyToken(req);
      const id = userAuth.id;

      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }

      const reactedPosts = await this.reactionsRepository
        .createQueryBuilder('posts')
        .leftJoinAndSelect('Posts.postEntity', 'postId')
        .orderBy('posts.createdAt', 'DESC')
        .where(`user_id = ${id} AND reactiuon_type = ${reaction}`)
        .getManyAndCount();

      return {
        reactedPosts: reactedPosts,
      };
    } catch (error) {
      Logger.log("error=> Can't get reacted posts", error);
      throw error;
    }
  }
}
