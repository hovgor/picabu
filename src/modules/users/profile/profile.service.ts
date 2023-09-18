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
import { PostReactionEntityBase } from 'src/modules/posts/entity/post.reactions.entity';
import { PostsEntityBase } from 'src/modules/posts/entity/posts.entity';
import { PagedSearchDto } from 'src/shared/dto/paged.search.dto';
import { UsersEntityBase } from '../entity/users.entity';
import { CommentsEntityBase } from '../entity/comments.entity';
import { RateCommentEntityBase } from '../entity/comments.rate.entity';
import { Utils } from 'src/shared/utils/utils';
import { Follow } from 'src/shared/types/followers';
import { UserFollowRequestEntitiyBase } from '../entity/follow.request.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserFollowEntitiyBase)
    private userFollowRepository: Repository<UserFollowEntitiyBase>,
    @InjectRepository(UsersEntityBase)
    private usersRepository: Repository<UsersEntityBase>,
    @InjectRepository(PostReactionEntityBase)
    private reactionsRepository: Repository<PostReactionEntityBase>,
    @InjectRepository(PostsEntityBase)
    private postsRepository: Repository<PostsEntityBase>,
    @InjectRepository(CommentsEntityBase)
    private commentsRepository: Repository<CommentsEntityBase>,
    @InjectRepository(PostReactionEntityBase)
    private postReactionEntityBase: Repository<PostReactionEntityBase>,
    @InjectRepository(RateCommentEntityBase)
    private rateCommentsRepository: Repository<RateCommentEntityBase>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(UserFollowRequestEntitiyBase)
    private readonly followRequestRepository: Repository<UserFollowRequestEntitiyBase>,

    @Inject(Utils)
    private readonly utils: Utils,
  ) {}

  // Get Followers Count
  async getFollowersCount(req: any, status: string, profileOwnerId: number) {
    try {
      let followersElseFollowings = '';
      if (status === 'followers') {
        followersElseFollowings = 'user';
      } else if (status === 'followings') {
        followersElseFollowings = 'follow_to_id';
      }

      const { userId } = req;
      const followersCount = await this.userFollowRepository
        .createQueryBuilder('followers')
        .where(`followers.${followersElseFollowings} = :id`, {
          id: profileOwnerId,
        })
        .getCount();

      return {
        data: { count: followersCount },
        error: false,
        message: 'Your followers count.',
      };
    } catch (error) {
      Logger.log("error=> Can't get followers count", error);
      throw error;
    }
  }

  async getFollowers(
    req: any,
    query: PagedSearchDto,
    status: string,
    profileOwnerId: number,
  ) {
    try {
      const { userId } = req;
      const blockedList = await this.utils.validBlockUser(userId);

      let followers: any = await this.userFollowRepository
        .createQueryBuilder('followers')
        .leftJoinAndSelect(
          `followers.${status === 'followings' ? 'followTo' : 'user'}`,
          'followUsers',
        )
        .limit(query.limit)
        .offset(query.offset)
        .where(
          `${
            status === 'followings' ? 'user_id' : 'follow_to_id'
          } = ${profileOwnerId}`,
        )
        .select([
          'followers.id',
          'followUsers.id',
          'followUsers.nickname',
          'followUsers.profilePhotoUrl',
          'followUsers.privacy',
        ])
        .getMany();

      followers = followers.map((item) => item.user || item.followTo);

      for (const user of followers) {
        if (profileOwnerId) {
          user.followStatus = 0;
          user.isBlocked = blockedList?.includes(userId);

          const userFollowsAccount = await this.userFollowRepository
            .createQueryBuilder('follows')
            .where({ user: userId, followTo: user.id })
            .select()
            .getOne();

          if (!userFollowsAccount) {
            const requested = await this.followRequestRepository
              .createQueryBuilder('requested')
              .where({
                user: userId,
                followTo: user.id,
                target: 'user',
              })
              .select()
              .getOne();

            if (requested) user.followStatus = 1;
          } else {
            user.followStatus = 2;
          }
        }
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
          .leftJoinAndSelect('followings.user', 'followingUsers')
          .limit(query.limit)
          .offset(query.offset)
          .orderBy('followings.createdAt', 'DESC')
          .where('followings.follow_to_id = :id', { id: userAuth.id })
          .select('followings')
          .addSelect([
            'followingUsers.id',
            'followingUsers.nickname',
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

  async getCreatedPostsCount(req: any) {
    try {
      const userAuth = await this.authService.verifyToken(req);
      const id = userAuth.id;

      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const createdPostsCount = await this.postsRepository
        .createQueryBuilder()
        .where(`user_id = ${id}`)
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

  async getReactions(query: any, body: any) {
    try {
      const { limit, offset, reactionId } = query;
      const { userId } = body;
      let reactionsList = [];
      const counts = [];

      if (reactionId != -1) {
        reactionsList = await this.postReactionEntityBase
          .createQueryBuilder('postReactions')
          .leftJoinAndSelect('postReactions.post', 'post')
          .leftJoinAndSelect('postReactions.user', 'user')
          .where({ reaction: reactionId, user: userId })
          .select([
            'postReactions.reaction',
            'postReactions.createdAt',
            'post.id',
            'post.title',
            'user.profilePhotoUrl',
          ])
          .limit(limit)
          .offset(offset)
          .orderBy('postReactions.created_date', 'DESC')
          .getMany();
      } else {
        reactionsList = await this.postReactionEntityBase
          .createQueryBuilder('postReactions')
          .leftJoinAndSelect('postReactions.post', 'post')
          .leftJoinAndSelect('postReactions.user', 'user')
          .where({ user: userId })
          .select([
            'postReactions.reaction',
            'postReactions.createdAt',
            'post.id',
            'post.title',
            'user.profilePhotoUrl',
          ])
          .limit(limit)
          .offset(offset)
          .orderBy('postReactions.created_date', 'DESC')
          .getMany();
      }

      for (let reaction = -1; reaction < 9; reaction++) {
        const reactCount = await this.postReactionEntityBase
          .createQueryBuilder('postReactions')
          .where(
            `${
              reaction == -1
                ? 'user_id=' + userId
                : 'user_id=' + userId + 'AND reaction_id = ' + reaction
            }`,
          )
          .select(['postReactions.id'])
          .getCount();

        counts.push({
          reactionId: reaction,
          count: reactCount,
        });
      }

      for (const reaction of reactionsList) {
        reaction.createdAt = Utils.generateDateInMs(reaction.createdAt);
        reaction.user.profilePhotoUrl
          ? Utils.generateS3Url(reaction.user, 1)
          : null;
      }

      return {
        data: { reactionsList, counts },
        error: false,
        message: 'Reactions List Recieved.',
      };
    } catch (error) {
      Logger.log("error=> Can't get reactions", error);
      throw error;
    }
  }

  async getAllMyCommentsFunction(req: any, data: PagedSearchDto) {
    try {
      const userAuth = await this.authService.verifyToken(req);
      const id = userAuth.id;

      const comments: any = await this.commentsRepository
        .createQueryBuilder('comments')
        .leftJoinAndSelect('comments.post', 'postId')
        .leftJoinAndSelect('comments.user', 'userId')
        .leftJoinAndSelect('comments.parentCommentId', 'parentCommentId')
        .orderBy('comments.createdAt', 'DESC')
        .select([
          'comments.id',
          'comments.rating',
          'comments.comment',
          'postId.title',
          'postId.id',
          // 'parentCommentId.id',
          'userId.nickname',
          'userId.profilePhotoUrl',
        ])
        .limit(data.limit)
        .offset(data.offset)
        .where(`comments.user = ${id} `)
        .getMany();

      for (const comment of comments) {
        const ifRated = await this.rateCommentsRepository
          .createQueryBuilder('ratedComment')
          .select(['ratedComment.rated'])
          .where(`comment_id=${comment.id} ${id ? 'AND user_id=' + id : ''}  `)
          .getOne();
        comment.rated = ifRated ? ifRated.rated : 0;

        comment.repliesCount = await this.commentsRepository
          .createQueryBuilder('postComments')
          .select('postComments')
          .where({ parentCommentId: comment.id })
          .getCount();
      }

      return { data: comments, message: 'Its your comments.', error: false };
    } catch (error) {
      Logger.log('error=> get all my comments', error);
      throw error;
    }
  }
}
