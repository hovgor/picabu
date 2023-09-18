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
import { Repository } from 'typeorm';
import { UsersEntityBase } from './entity/users.entity';
import { PostReactionEntityBase } from '../posts/entity/post.reactions.entity';
import { AuthService } from 'src/auth/auth.service';
import { CommentsEntityBase } from './entity/comments.entity';
import { CommentsReactionsEntityBase } from './entity/comments.reactions.entity';
import { SubscribeGroupEntityBase } from './entity/subscribe.group.entity';
import { GroupsService } from '../groups/groups.service';
import { GroupsEntityBase } from '../groups/entity/groups.entity';
import { PostsEntityBase } from '../posts/entity/posts.entity';
import { UserFollowEntitiyBase } from './entity/user.following.entity';
import { BlockedEntityBase } from './entity/blocked.entity';
import { ReplyCommentDto } from './dto/reply.dto';
import { CommentDto } from './dto/comment.dto';
import { CommentsReactionsDto } from './dto/comments.reactions.dto';
import { PagedSearchDto } from 'src/shared/dto/paged.search.dto';
import { UserValidator } from 'src/shared/validators/user.validator';
import { DontRecommendEntityBase } from './entity/dont.recommend.entity';
import { ReportEntityBase } from './entity/report.entity';
import { UserFollowRequestEntitiyBase } from './entity/follow.request.entity';
import { QuestionsDto } from './settings/dto/questions.dto';
import { helpEntityBase } from './entity/help.entity';
import { questionsEntityBase } from './entity/questions.entity';
import { FeedQuery } from './dto/feed.query.dto';
import { Utils } from 'src/shared/utils/utils';
import { PostReactionCountEntityBase } from '../posts/entity/posts.reactions.count.entity';
import { PostReactions } from 'src/shared/types/reactions';
import { BlockedUserDto } from './dto/blocked.user.dto';
import { RateDto } from './dto/rate.dto';
import { TargetType } from 'src/shared/types/rate_target';
import { RatePostEntityBase } from './entity/posts.rate.entity';
import { RateCommentEntityBase } from './entity/comments.rate.entity';
import { FavoritsEntityBase } from '../posts/entity/favorite.post.entity';
import { UserJoinedCommunitiesEntityBase } from '../groups/entity/userJoinedGroups.entity';
import { followUnfollowBodyDto } from './dto/followBody.dto';
import { TagsPostEntityBase } from '../tags/entity/tags.for.posts.entity';
import { Paginate } from './dto/paginate.dto';
import { NotificationsService } from 'src/notifications/notifications.service';
import { DeleteAccountDto } from './dto/settings.dto';
import { HashPassword } from 'src/shared/password-hash/hash.password';
import { AdminsForComunityEntityBase } from '../groups/entity/admins.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntityBase)
    private usersRepository: Repository<UsersEntityBase>,

    @InjectRepository(FavoritsEntityBase)
    private favoritesRepository: Repository<FavoritsEntityBase>,

    @InjectRepository(GroupsEntityBase)
    private groupsRepository: Repository<GroupsEntityBase>,

    @InjectRepository(ReportEntityBase)
    private reportRepository: Repository<ReportEntityBase>,

    @InjectRepository(UserJoinedCommunitiesEntityBase)
    private userJoinedCommunitiesRepository: Repository<UserJoinedCommunitiesEntityBase>,

    @InjectRepository(BlockedEntityBase)
    private blockedListRepository: Repository<BlockedEntityBase>,

    @InjectRepository(DontRecommendEntityBase)
    private dontRecommendRepository: Repository<DontRecommendEntityBase>,

    @InjectRepository(PostReactionEntityBase)
    private postsReactionRepository: Repository<PostReactionEntityBase>,

    @InjectRepository(PostsEntityBase)
    private postsRepository: Repository<PostsEntityBase>,

    @InjectRepository(BlockedEntityBase)
    private blockedRepository: Repository<BlockedEntityBase>,

    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,

    @InjectRepository(CommentsEntityBase)
    private commentRepository: Repository<CommentsEntityBase>,

    @InjectRepository(CommentsReactionsEntityBase)
    private commentsReactionsEntityBase: Repository<CommentsReactionsEntityBase>,

    @InjectRepository(UserFollowEntitiyBase)
    private userFollowRepository: Repository<UserFollowEntitiyBase>,

    @InjectRepository(SubscribeGroupEntityBase)
    private subscribeGroupRepository: Repository<SubscribeGroupEntityBase>,

    @InjectRepository(helpEntityBase)
    private helpRepository: Repository<helpEntityBase>,

    @InjectRepository(questionsEntityBase)
    private questionsRepository: Repository<questionsEntityBase>,

    @Inject(GroupsService)
    private readonly groupsService: GroupsService,

    @InjectRepository(UserFollowRequestEntitiyBase)
    private readonly followRequestRepository: Repository<UserFollowRequestEntitiyBase>,

    @InjectRepository(PostsEntityBase)
    private readonly postRepository: Repository<PostsEntityBase>,

    @InjectRepository(PostReactionCountEntityBase)
    private readonly postReactionCountEntityBase: Repository<PostReactionCountEntityBase>,

    @InjectRepository(RatePostEntityBase)
    private readonly ratePostEntityBase: Repository<RatePostEntityBase>,

    @InjectRepository(RateCommentEntityBase)
    private readonly rateCommentEntityBase: Repository<RateCommentEntityBase>,

    @InjectRepository(TagsPostEntityBase)
    private tagsPostRepository: Repository<TagsPostEntityBase>,

    @Inject(forwardRef(() => HashPassword))
    private readonly passwordHashing: HashPassword,

    @InjectRepository(AdminsForComunityEntityBase)
    private adminsForComunityRepository: Repository<AdminsForComunityEntityBase>,

    @Inject(Utils)
    private readonly utils: Utils,

    @Inject(NotificationsService)
    private readonly notifService: NotificationsService,

    private readonly userValidator: UserValidator,
  ) {}

  // get me
  async getMe(request: any) {
    try {
      const userAuth = await this.authService.verifyToken(request);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }

      const userData = {
        nicname: userAuth.nickname,
        email: userAuth.email,
        phone: userAuth.phone,
        deviceId: userAuth.deviceId,
        role: userAuth.role,
        profilePhotoUrl: userAuth.profilePhotoUrl,
        backgroundPhotoUrl: userAuth.backgroundPhotoUrl,
        createDate: userAuth.createdAt,
      };

      return { data: userData, error: false, message: 'User data.' };
    } catch (error) {
      Logger.log('error=> get me function ', error);
      throw error;
    }
  }

  // get user by Id
  async getUserById(ownerId: number, req: any) {
    try {
      const { userId } = req.body;
      const data: any = {};
      const blockedList = await this.utils.validBlockUser(userId);

      const user = await this.usersRepository
        .createQueryBuilder('user')
        .where({ id: ownerId })
        .select([
          'user.nickname',
          'user.email',
          'user.profilePhotoUrl',
          'user.backgroundPhotoUrl',
          'user.deviceId',
          'user.rating',
          'user.privacy',
          'user.createdAt',
        ])
        .getOne();

      if (!user) {
        Logger.log('id is not defined!!');
        throw new NotFoundException('User does not exist!!!');
      }

      if (ownerId != userId) {
        data.followStatus = 0;
        data.isBlocked = blockedList?.includes(userId);

        const userFollowsAccount = await this.userFollowRepository
          .createQueryBuilder('follows')
          .where({ user: userId, followTo: ownerId })
          .select()
          .getOne();

        if (!userFollowsAccount) {
          const requested = await this.followRequestRepository
            .createQueryBuilder('requested')
            .where({ user: userId, followTo: ownerId, target: 'user' })
            .select()
            .getOne();
          if (requested) data.followStatus = 1;
        } else {
          data.followStatus = 2;
        }
      }

      data.user = user;
      data.postsCount = await this.postRepository
        .createQueryBuilder('posts')
        .where({ user: ownerId })
        .getCount();

      data.commentsCount = await this.commentRepository
        .createQueryBuilder('comments')
        .where({ user: ownerId })
        .getCount();

      data.reactionsCount = await this.postsReactionRepository
        .createQueryBuilder('reactions')
        .where({ user: ownerId })
        .getCount();

      data.following = await this.userFollowRepository
        .createQueryBuilder('followings')
        .where({ user: ownerId })
        .getCount();

      data.followers = await this.userFollowRepository
        .createQueryBuilder('followers')
        .where({ followTo: ownerId })
        .getCount();

      return {
        data,
        error: false,
        message: 'User data.',
      };
    } catch (error) {
      Logger.log('error=> get user by Id', error);
      throw error;
    }
  }
  // get user whit email
  async getUserWhitEmail(email: string) {
    try {
      if (!email) {
        throw new BadRequestException('email is not exist');
      }
      return await this.usersRepository.findOne({ where: { email: email } });
    } catch (error) {
      Logger.log('Email is not defined!!');
      throw error;
    }
  }

  // get user whit nickname
  async getUserWhitNickname(nickname: string) {
    try {
      const validNickname = this.userValidator.userNickname(nickname);
      return await this.usersRepository.findOne({
        where: { nickname: validNickname },
      });
    } catch (error) {
      Logger.log('nickname is not defined!!!');
      throw error;
    }
  }

  // delete user whit Id
  async deleteUserWhitId(data: DeleteAccountDto) {
    try {
      const { userId, password } = data;

      const user = await this.usersRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        Logger.log('user does not exist!!');
        throw new BadRequestException('User is not exist!!! ');
      }
      const isMatch = await this.passwordHashing.IsMutchPassword(
        password,
        user.password,
      );
      if (!isMatch) {
        throw new BadRequestException(
          ' Password is wrong!!! \n Please write again!!!',
        );
      }

      await this.usersRepository.delete(userId);
      return {
        data: null,
        message: 'User has been deleted!',
        error: false,
      };
    } catch (error) {
      Logger.log('error=> delete user whit Id function!!', error);
      throw error;
    }
  }

  async commentPost(body: CommentDto) {
    try {
      const { userId, commentId, postId, comment } = body;

      const post: any = await this.postRepository.findOne({
        where: { id: postId },
        relations: ['user'],
      });

      if (!post) {
        throw new NotFoundException('Post does not exist !');
      }

      if (commentId) {
        const commented = await this.commentRepository.findOne({
          where: { id: commentId, user: userId, post: postId },
        });
        if (!commented)
          throw new NotFoundException(
            "Comment does not exist and can't be updated !",
          );

        await this.commentRepository.update(
          { id: commentId, user: userId, post: postId },
          { comment },
        );

        return {
          data: null,
          error: false,
          message: `Comment edited successfully !`,
        };
      }

      await this.commentRepository.save(
        this.commentRepository.create({
          user: userId,
          post: postId,
          comment,
        }),
      );

      await this.postRepository.update(
        { id: postId },
        { rating: post.rating + 1 },
      );

      await this.notifService.sendAndSaveNotification(post.user.id, 5, {
        relatedUser: userId,
        relatedPost: postId,
      });
      return {
        data: null,
        error: false,
        message: `commented successfully`,
      };
    } catch (error) {
      Logger.log('error=> create comment function!!', error);
      throw error;
    }
  }

  async replyCommentPost(body: ReplyCommentDto) {
    try {
      const { commentId, userId, comment, replyId } = body;

      const parentComment: any = await this.commentRepository.findOne({
        where: { id: commentId },
        relations: ['post'],
      });

      const post: any = await this.postRepository.findOne({
        where: { id: parentComment.post.id },
        relations: ['user'],
      });

      if (!parentComment.id) {
        throw new NotFoundException(
          'Such comment does not exists to be replied !!!',
        );
      }

      if (replyId) {
        const commented = await this.commentRepository.findOne({
          where: { id: replyId, user: userId, parentCommentId: commentId },
        });
        if (!commented)
          throw new NotFoundException(
            "Reply does not exist and can't be updated !",
          );

        await this.commentRepository.update(
          { id: replyId, user: userId, parentCommentId: commentId },
          { comment },
        );

        return {
          data: null,
          error: false,
          message: `Reply edited successfully !`,
        };
      }

      await this.commentRepository.save(
        this.commentRepository.create({
          user: userId,
          parentCommentId: commentId,
          comment: comment,
        }),
      );

      await this.notifService.sendAndSaveNotification(post.user.id, 6, {
        relatedUser: userId,
        relatedPost: post.id,
      });
      return {
        data: null,
        error: false,
        message: `Replied Successfully !`,
      };
    } catch (error) {
      Logger.log('error=> create comment function!!', error);
      throw error;
    }
  }

  async reactComment(body: CommentsReactionsDto) {
    const { commentId, reactionId, userId } = body;
    try {
      const exists = await this.commentsReactionsEntityBase
        .createQueryBuilder('postUserReactions')
        .select(['postUserReactions.id'])
        .where({ comment: commentId, reaction: reactionId, user: userId })
        .getOne();

      if (exists?.id) {
        await this.commentsReactionsEntityBase.delete({
          id: exists.id,
        });

        return {
          data: null,
          error: false,
          message: `UnReacted the ${PostReactions[reactionId]}!`,
        };
      }

      await this.commentsReactionsEntityBase
        .createQueryBuilder()
        .insert()
        .values([{ user: userId, comment: commentId, reaction: reactionId }])
        .orUpdate(['reaction_id'], ['user_id', 'comment_id'])
        .execute();

      return {
        data: null,
        error: false,
        message: `Reacted as ${PostReactions[reactionId]}!`,
      };
    } catch (error) {
      Logger.log('error=> React Comment ', error);
      throw error;
    }
  }

  async deleteCommentById(req: any, id: number) {
    try {
      const { userId } = req.body;

      const comment: any = await this.commentRepository.findOne({
        where: { id },
        relations: ['user', 'parentCommentId'],
      });
      if (!comment) {
        throw new BadRequestException('Comment does not exist!!!');
      }

      const post: any = await this.postRepository.findOne({
        where: { id: comment.post },
        relations: ['user'],
      });

      if (userId !== comment.user.id && userId !== post.user.id) {
        throw new UnauthorizedException(
          "Not allowed to delete someone else's comment!!!",
        );
      }

      comment.parentCommentId
        ? await this.notifService.deleteNotification(post.user.id, 6, {
            relatedUser: userId,
            relatedPost: post.id,
          })
        : await this.notifService.deleteNotification(post.user.id, 5, {
            relatedUser: userId,
            relatedPost: post.id,
          });
      await this.commentRepository.delete(id);
      return;
    } catch (error) {
      Logger.log('delete comment by Id function');
      throw error;
    }
  }

  async getFeed(query: FeedQuery, request: any) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;
      const { limit, offset, status } = query;
      let feed;
      let orderCase;
      let excludedUsers;
      const user: UsersEntityBase = request.headers['authorization']
        ? await this.authService.verifyToken(request)
        : null;

      if (user?.id) {
        const dontReccomend = await this.utils.dontRecommendList(user.id);
        const blockedList = await this.utils.validBlockUser(user.id);
        excludedUsers = [...new Set([...dontReccomend, ...blockedList])];
      }

      switch (status) {
        case 'new':
          orderCase = 'created_date';
          feed = await newTopQuery(orderCase);
          break;
        case 'top':
          orderCase = 'rating';
          feed = await newTopQuery(orderCase);
          break;
        case 'my':
          if (!user) throw new UnauthorizedException('User not authorized!!!');
          orderCase = 'created_date';
          feed = await myFeedQuery(orderCase);
          break;
      }

      async function newTopQuery(orderCase) {
        const userCase = user?.id
          ? ` UNION
        SELECT
        "posts".ID,
        "posts".title,
        "posts".description,
        "posts".rating,
        "posts".created_date,
        "posts"."user_id",
        "posts".comments_count,
        "users".nickname,
        "users"."profile_photo_url" 
        FROM
        "posts"
        INNER JOIN "users" ON "posts"."user_id" = "users"."id" 
        WHERE
        "users"."privacy" = TRUE 
        ${
          user.id && excludedUsers.length
            ? `AND "posts"."user_id" NOT IN ( ${excludedUsers} ) `
            : ''
        }
        AND "posts"."user_id" IN ( SELECT follow_to_id FROM user_following WHERE "user_id" = ${
          user.id
        } )`
          : '';

        return await self.postsRepository.query(
          `SELECT
        "posts".ID,
        "posts".title,
        "posts".description,
        "posts".rating,
        "posts".created_date,
        "posts"."user_id" AS userId,
        "posts".comments_count,
        "users".nickname,
        "users"."profile_photo_url" 
      FROM
        "posts"
        INNER JOIN "users" ON "posts"."user_id" = "users"."id" 
      WHERE
        "users"."privacy" = FALSE
        ${
          user?.id && excludedUsers?.length
            ? `AND "posts"."user_id" NOT IN ( ${excludedUsers} ) `
            : ''
        }
        ${userCase} ORDER BY ${orderCase} DESC
        limit ${limit} offset ${offset} `,
        );
      }

      async function myFeedQuery(orderCase) {
        orderCase;
        return await self.postsRepository.query(
          `SELECT
        "posts".ID,
        "posts".title,
        "posts".description,
        "posts".rating,
        "posts".created_date,
        "posts"."user_id" AS userId,
        "posts".comments_count,
        "users".nickname,
        "users"."profile_photo_url" 
      FROM
        "posts"
        INNER JOIN "users" ON "posts"."user_id" = "users"."id" 
        WHERE
        "posts"."user_id" IN ( SELECT follow_to_id FROM user_following WHERE "user_id" = ${user.id} )
        ORDER BY "posts".created_date DESC
        limit ${limit} offset ${offset} `,
        );
      }

      for (const post of feed) {
        Utils.generateResponseObj(post);
        post.profilePhotoUrl ? Utils.generateS3Url(post, 1) : null;
        const reactions = await this.postReactionCountEntityBase
          .createQueryBuilder('postReactions')
          .select(['postReactions.reaction', 'postReactions.count'])
          .where({ post: post.id })
          .getMany();
        post.reactionsCount = reactions.reduce(
          (sum, obj) => sum + obj.count,
          0,
        );

        post.commentsCount = await this.commentRepository
          .createQueryBuilder('postComments')
          .select(['postComments.id'])
          .where({ post: post.id })
          .getCount();

        const rated: any = await this.ratePostEntityBase
          .createQueryBuilder('ratedPost')
          .select(['ratedPost.rated'])
          .where(
            `post_id=${post.id} ${user?.id ? 'AND user_id=' + user.id : ''}  `,
          )
          .getOne();

        if (user?.id) {
          post.favorite = !!(await this.favoritesRepository
            .createQueryBuilder('ifFavorite')
            .select(['ifFavorite.id'])
            .where({ post: post.id, user: user.id })
            .getOne());
        }

        post.rated = rated ? rated.rated : 0;
        post.createdDate = Utils.generateDateInMs(post.createdDate); // convert Date to miliseconds

        post.user = {
          id: post.userid,
          profilePhotoUrl: post.profilePhotoUrl,
          nickname: post.nickname,
        };

        const tags: any = await this.tagsPostRepository
          .createQueryBuilder('tags')
          .leftJoinAndSelect('tags.tag', 'tag')
          .select(['tags.id', 'tag.name'])
          .where({ post: post.id })
          .getMany();

        post.tags = tags.map((elem) => elem.tag.name);

        delete post.userid;
        delete post.nickname;
        delete post.profilePhotoUrl;
      }

      return { data: feed, error: false, message: 'Feed Data Recieved !' };
    } catch (error) {
      Logger.log('error=> Get feed function ', error);
      throw error;
    }
  }

  async toBlockedUser(body: BlockedUserDto) {
    try {
      const { userId, blockUserId } = body;

      const alreadyBlocked = await this.blockedListRepository.findOne({
        where: { user: userId, blockedUser: blockUserId },
      });

      if (alreadyBlocked?.id) {
        await this.blockedListRepository.delete({
          id: alreadyBlocked.id,
        });
        return {
          data: null,
          error: false,
          message: `User UnBlocked!`,
        };
      }

      await this.blockedListRepository.save(
        this.blockedListRepository.create({
          user: userId,
          blockedUser: blockUserId,
        }),
      );

      return {
        data: null,
        error: false,
        message: `User blocked!`,
      };
    } catch (error) {
      Logger.log('Error=> block/unblock user function ', error);
      throw error;
    }
  }

  // unblock user
  async toUnBlockedUser(unblockedUserId: number, request: any) {
    try {
      const user: UsersEntityBase = await this.authService.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      await this.blockedListRepository
        .createQueryBuilder()
        .delete()
        .from(BlockedEntityBase)
        .where({ user: user.id })
        .andWhere({
          blockedUser: unblockedUserId,
        })
        .execute();
      return {
        data: null,
        error: false,
        message: `user ${user.nickname} unbloked user whit ${unblockedUserId} id!`,
      };
    } catch (error) {
      Logger.log('error=> unblocked user function ', error);
      throw error;
    }
  }

  // get my blocked list
  async getBlockedList(request: Paginate, req: any) {
    try {
      const { userId } = req.body;
      const result = await this.blockedListRepository
        .createQueryBuilder('blocked')
        .leftJoinAndSelect('blocked.blockedUser', 'userId')
        .orderBy('blocked.createdAt', 'DESC')
        .select([
          'blocked.id',
          'userId.nickname',
          'userId.profilePhotoUrl',
          'userId.id',
        ])
        .limit(request.limit)
        .offset(request.offset)
        .where(`blocked.user = ${userId} `)
        .getMany();

      return {
        data: result,
        message: 'Your blocked list.',
        error: false,
      };
    } catch (error) {
      Logger.log('get blocked list function ', error);
      throw error;
    }
  }
  async getBlockedListCount(req: any) {
    try {
      const { userId } = req.body;
      const count = await this.blockedListRepository
        .createQueryBuilder('blocked')
        .where(`blocked.user = ${userId} `)
        .getCount();

      return {
        data: { count },
        message: 'Your blocked list count.',
        error: false,
      };
    } catch (error) {
      Logger.log('get blocked list function ', error);
      throw error;
    }
  }

  // dont recommend post
  async dontRecommend(body: any, req: any) {
    try {
      const user: UsersEntityBase = await this.authService.verifyToken(req);
      if (!user) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      await this.dontRecommendRepository.save(
        this.dontRecommendRepository.create({
          user: user.id,
          undesired: body.dontRecommendId,
        }),
      );

      return {
        data: null,
        error: false,
        message: 'Author marked as not recommended !',
      };
    } catch (error) {
      Logger.log(error);
    }
  }

  async report(body: any) {
    try {
      const { userId, type, target, relatedId } = body;
      await this.reportRepository
        .createQueryBuilder()
        .insert()
        .into('report')
        .values({
          user: userId,
          type,
          target,
          related_id: relatedId,
        })
        .onConflict(`("user_id", "type", "related_id") DO NOTHING`)
        .execute();

      return {
        data: null,
        error: false,
        message: 'Reported Successfully !',
      };
    } catch (error) {
      Logger.log('report function', error);
      throw error;
    }
  }

  // get comment of the day
  async getCommentOfTheDay(query: PagedSearchDto, body: any) {
    try {
      const { userId } = body;

      const newDate = new Date();
      newDate.setDate(newDate.getDate() - 1);
      const comments: any = await this.commentRepository
        .createQueryBuilder('Posts_comments')
        .leftJoinAndSelect('Posts_comments.user', 'user')
        .leftJoinAndSelect('Posts_comments.post', 'postId')
        .limit(query.limit)
        .offset(query.offset)
        .where('Posts_comments.createdAt > :date', { date: newDate })
        .select('Posts_comments')
        .orderBy(`Posts_comments.rating`, 'DESC')
        .addSelect([
          'user.id',
          'user.nickname',
          'user.profilePhotoUrl',
          'postId.title',
          'postId.id',
        ])
        .getMany();

      for (const comment of comments) {
        comment.repliesCount = await this.commentRepository
          .createQueryBuilder('postComments')
          .select('postComments')
          .where({ parentCommentId: comment.id })
          .getCount();

        const ifRated = await this.rateCommentEntityBase
          .createQueryBuilder('ratedComment')
          .select(['ratedComment.rated'])
          .where(
            `comment_id=${comment.id} ${
              userId ? 'AND user_id=' + userId : ''
            }  `,
          )
          .getOne();

        comment.rated = ifRated ? ifRated.rated : 0;
        comment.createdAt = Utils.generateDateInMs(comment.createdAt);
        comment.user.profilePhotoUrl
          ? Utils.generateS3Url(comment.user, 1)
          : null;
      }

      return {
        data: comments,
        error: false,
        message: 'This is comment of the day.',
      };
    } catch (error) {
      Logger.log('error=> get comment of the day function ', error);
      throw error;
    }
  }

  async getHelp(req: any) {
    try {
      const user: UsersEntityBase = await this.authService.verifyToken(req);
      if (!user) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const getHelp = await this.helpRepository.find({
        select: {
          id: true,
          title: true,
          description: true,
        },
      });
      return getHelp;
    } catch (error) {
      throw error;
    }
  }

  async sendQuestion(body: QuestionsDto, req: any) {
    try {
      const user: UsersEntityBase = await this.authService.verifyToken(req);
      if (!user) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const sendQuestion = await this.questionsRepository.save(
        this.questionsRepository.create({
          question: body.text,
          userId: body.userId,
        }),
      );
      return sendQuestion;
    } catch (error) {
      throw error;
    }
  }

  async followUnfollow(body: followUnfollowBodyDto, target: any) {
    try {
      const { userId, relatedId, status } = body;
      const response = {
        data: null,
        error: false,
        message: 'No Action Done !',
      };
      if (userId === relatedId) {
        throw new BadRequestException("You can't subscribe to yourself.");
      }
      switch (status) {
        case 0: // No Relation Case
          if (target == 'user') {
            const user = await this.usersRepository
              .createQueryBuilder('user')
              .select('user.privacy')
              .where('user.id = :id', { id: relatedId })
              .getOne();

            if (user?.privacy) {
              await this.followRequestRepository
                .createQueryBuilder()
                .insert()
                .into(UserFollowRequestEntitiyBase)
                .values([{ user: userId, followTo: relatedId, target }])
                .execute();
              await this.notifService.sendAndSaveNotification(relatedId, 1, {
                relatedUser: userId,
              });
              response.message = 'Follow Request Sent To User !';
            } else {
              await this.userFollowRepository
                .createQueryBuilder()
                .insert()
                .into(UserFollowEntitiyBase)
                .values([{ user: userId, followTo: relatedId }])
                .execute();
              await this.notifService.sendAndSaveNotification(relatedId, 0, {
                relatedUser: userId,
              });
              response.message = 'Successfully Followed To User !';
            }
          }

          if (target == 'community') {
            const community = await this.groupsRepository
              .createQueryBuilder('community')
              .select('community.privacy')
              .where('community.id = :id', { id: relatedId })
              .getOne();

            if (community?.privacy) {
              await this.followRequestRepository
                .createQueryBuilder()
                .insert()
                .into(UserFollowRequestEntitiyBase)
                .values([{ user: userId, followTo: relatedId, target }])
                .execute();

              const admins: any = await this.adminsForComunityRepository.find({
                where: { group: relatedId },
                relations: ['user'],
              });
              for (const admin of admins) {
                await this.notifService.sendAndSaveNotification(
                  admin.user.id,
                  2,
                  { relatedUser: userId, relatedCommunity: relatedId },
                );
              }

              response.message = 'Subscribe Request Sent To Community Admins !';
            } else {
              await this.subscribeGroupRepository
                .createQueryBuilder()
                .insert()
                .into(SubscribeGroupEntityBase)
                .values([{ user: userId, community: relatedId }])
                .execute();

              const admins: any = await this.adminsForComunityRepository.find({
                where: { group: relatedId },
                relations: ['user'],
              });
              for (const admin of admins) {
                await this.notifService.sendAndSaveNotification(
                  admin.user.id,
                  3,
                  { relatedUser: userId, relatedCommunity: relatedId },
                );
              }

              response.message = 'Subscribed To Community !';
            }
          }
          break;

        case 1: // Pending Request Case
          await this.followRequestRepository.delete({
            user: userId,
            followTo: relatedId,
            target,
          });

          switch (target) {
            case 'user':
              await this.notifService.deleteNotification(relatedId, 0, {
                relatedUser: userId,
              });
              response.message = 'Follow Request Cancelled !';
              break;

            case 'community':
              const admins: any = await this.adminsForComunityRepository.find({
                where: { group: relatedId },
                relations: ['user'],
              });
              for (const admin of admins) {
                await this.notifService.deleteNotification(admin.user.id, 2, {
                  relatedUser: userId,
                  relatedCommunity: relatedId,
                });
              }
              response.message = 'Subscribe Request To Community Cancelled !';
              break;
          }

          break;

        case 2: // Following Case
          if (target == 'user') {
            await this.userFollowRepository.delete({
              user: userId,
              followTo: relatedId,
            });
            await this.notifService.deleteNotification(relatedId, 0, {
              relatedUser: userId,
            });
            response.message = 'Unfollowed User Successfully !';
          } else {
            await this.subscribeGroupRepository.delete({
              user: userId,
              community: relatedId,
            });

            const admins: any = await this.adminsForComunityRepository.find({
              where: { group: relatedId },
              relations: ['user'],
            });
            for (const admin of admins) {
              await this.notifService.deleteNotification(admin.user.id, 2, {
                relatedUser: userId,
                relatedCommunity: relatedId,
              });
            }
            response.message = 'Unsubscribed Community Successfully !';
          }
          break;
        default:
          break;
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async getFollowRequests(query, body) {
    const { userId } = body;
    const { limit, offset } = query;
    const followers: any = await this.followRequestRepository
      .createQueryBuilder('requests')
      .leftJoinAndSelect('requests.user', 'user')
      .select([
        'requests.id',
        'requests.createdAt',
        'user.id',
        'user.nickname',
        'user.profilePhotoUrl',
      ])
      .where({ followTo: userId, target: 'user' })
      .orderBy('requests.createdAt', 'DESC')
      .limit(limit)
      .offset(offset)
      .getMany();

    followers.forEach((element) => {
      element.createdAt = Utils.generateDateInMs(element.createdAt);
    });

    return {
      data: followers,
      error: false,
      message: 'Follow requests recieved !',
    };
  }

  async getSubscribeRequests(query, body) {
    const { userId } = body;
    const { limit, offset } = query;
    let requests = [];

    let adminning: any = await this.adminsForComunityRepository.find({
      where: { user: userId },
      relations: ['group'],
    });
    adminning = adminning?.map((elem) => elem.group.id);

    if (adminning.length) {
      requests = await this.followRequestRepository
        .createQueryBuilder('requests')
        .leftJoinAndSelect('requests.user', 'user')
        .select([
          'requests.id',
          'requests.createdAt',
          'requests.followTo',
          'user.id',
          'user.nickname',
          'user.profilePhotoUrl',
        ])
        .where(`follow_to_id IN (${adminning})`)
        .andWhere({ target: 'community' })
        .orderBy('requests.createdAt', 'DESC')
        .limit(limit)
        .offset(offset)
        .getMany();
    }

    for (const request of requests) {
      const community = await this.groupsRepository.findOne({
        where: { id: request.followTo },
      });
      request.communityId = community.id;
      request.communityTitle = community.name;
      delete request.followTo;
      request.user.profilePhotoUrl
        ? Utils.generateS3Url(request.user, 1)
        : null;
    }

    return {
      data: requests,
      error: false,
      message: 'Subscribe requests recieved !',
    };
  }

  async acceptFollowRequest(body) {
    try {
      const { communityId, followeeId, userId } = body;
      let requestExists: any;
      const target = communityId ? 'community' : 'user';

      switch (target) {
        case 'user':
          requestExists = await this.followRequestRepository
            .createQueryBuilder('request')
            .select()
            .where({ followTo: userId, user: followeeId, target })
            .getOne();

          if (!requestExists) {
            throw new BadRequestException('No such follow request !');
          }

          await this.userFollowRepository
            .createQueryBuilder()
            .insert()
            .into(UserFollowEntitiyBase)
            .values([{ user: followeeId, followTo: userId }])
            .execute();

          await this.followRequestRepository.delete(requestExists.id);
          await this.notifService.deleteNotification(userId, 1, {
            relatedUser: followeeId,
          });

          return {
            data: null,
            error: false,
            message: 'Follow Request Accepted Successfully !',
          };

        case 'community':
          requestExists = await this.followRequestRepository
            .createQueryBuilder('request')
            .select()
            .where({ followTo: communityId, user: followeeId, target })
            .getOne();

          if (!requestExists) {
            throw new BadRequestException('No such follow request !');
          }

          await this.subscribeGroupRepository
            .createQueryBuilder()
            .insert()
            .into(SubscribeGroupEntityBase)
            .values([{ user: followeeId, community: communityId }])
            .execute();

          await this.followRequestRepository.delete(requestExists.id);
          await this.notifService.deleteNotification(null, 2, {
            relatedUser: followeeId,
            relatedCommunity: communityId,
          });

          return {
            data: null,
            error: false,
            message: 'Subscribtion accepted Successfully !',
          };
        default:
          return {
            data: null,
            error: false,
            message: 'Nothing Happened check sent variables !',
          };
      }
    } catch (error) {
      throw error;
    }
  }

  async declineFollowRequest(body) {
    try {
      const { communityId, followeeId, userId } = body;
      let requestExists: any;
      const target = communityId ? 'community' : 'user';

      switch (target) {
        case 'user':
          requestExists = await this.followRequestRepository
            .createQueryBuilder('request')
            .select()
            .where({ followTo: userId, user: followeeId, target })
            .getOne();

          if (!requestExists) {
            throw new BadRequestException('No such follow request !');
          }

          await this.followRequestRepository.delete(requestExists.id);
          await this.notifService.deleteNotification(userId, 1, {
            relatedUser: followeeId,
          });
          return {
            data: null,
            error: false,
            message: 'Follow Request Declined Successfully !',
          };

        case 'community':
          requestExists = await this.followRequestRepository
            .createQueryBuilder('request')
            .select()
            .where({ followTo: communityId, user: followeeId, target })
            .getOne();

          if (!requestExists) {
            throw new BadRequestException('No such follow request !');
          }

          await this.followRequestRepository.delete(requestExists.id);
          await this.notifService.deleteNotification(null, 2, {
            relatedUser: followeeId,
            relatedCommunity: communityId,
          });
          return {
            data: null,
            error: false,
            message: 'Subscribtion Declined Successfully !',
          };
        default:
          return {
            data: null,
            error: false,
            message: 'Nothing Happened check sent variables !',
          };
      }
    } catch (error) {
      throw error;
    }
  }

  async acceptAllFollowRequests(target, targetId) {
    switch (target) {
      case 'user':
        await this.followRequestRepository
          .createQueryBuilder('request')
          .select()
          .where({ followTo: targetId, target })
          .getMany();

        await this.userFollowRepository
          .createQueryBuilder()
          .insert()
          .into(UserFollowEntitiyBase)
          .values([{ user: target, followTo: targetId }])
          .execute();
        break;
      case 'community':
        break;
      default:
        break;
    }
  }

  async rate(body: RateDto, target: TargetType) {
    try {
      if (target != 'post' && target != 'comment')
        throw new BadRequestException('Check params !');
      const { userId, targetId, rate } = body;

      if (target == 'post') {
        const post: any = await this.postRepository.findOne({
          where: { id: targetId },
          relations: ['user'],
        });

        const query = `
            INSERT INTO post_rates (user_id, post_id, rated)
            VALUES ($1, $2, $3) ON CONFLICT (user_id, post_id)
            DO UPDATE SET rated = CASE
            WHEN post_rates.rated + $3 > 1 THEN 1
            WHEN post_rates.rated + $3 < -1 THEN -1
            ELSE post_rates.rated + $3
            END
            RETURNING (
              SELECT rated FROM post_rates WHERE user_id = $1 AND post_id = $2
          ) as initial_rated,
          rated,user_id
        `;

        const result = await this.ratePostEntityBase.query(query, [
          userId,
          targetId,
          rate,
        ]);

        const { initial_rated, rated, user_id } = result[0];

        if (initial_rated !== rated) {
          switch (rated) {
            case -1:
              await this.notifService.sendAndSaveNotification(post.user.id, 7, {
                relatedUser: userId,
                relatedPost: targetId,
              });
              break;
            case 0:
              if (initial_rated == -1) {
                await this.notifService.deleteNotification(post.user.id, 7, {
                  relatedUser: userId,
                  relatedPost: targetId,
                });
              } else {
                await this.notifService.deleteNotification(post.user.id, 8, {
                  relatedUser: userId,
                  relatedPost: targetId,
                });
              }
              break;
            case 1:
              await this.notifService.sendAndSaveNotification(post.user.id, 8, {
                relatedUser: userId,
                relatedPost: targetId,
              });
              break;
          }

          await this.postRepository.query(
            `
            UPDATE posts
            SET rating = rating + $1
            WHERE id = $2
            `,
            [rate, targetId],
          );

          await this.usersRepository.query(
            `
            UPDATE users
            SET rating = rating + $1
            WHERE id = $2
            `,
            [rate, user_id],
          );
        }
      }

      if (target == 'comment') {
        const query = `
            INSERT INTO comment_rates (user_id, comment_id, rated)
            VALUES ($1, $2, $3) ON CONFLICT (user_id, comment_id)
            DO UPDATE SET rated =CASE
            WHEN comment_rates.rated + $3 > 1 THEN 1
            WHEN comment_rates.rated + $3 < -1 THEN -1
            ELSE comment_rates.rated + $3
            END
            RETURNING (
              SELECT rated FROM comment_rates WHERE user_id = $1 AND comment_id = $2
          ) as initial_rated,
          rated,user_id
         `;

        const result = await this.rateCommentEntityBase.query(query, [
          userId,
          targetId,
          rate,
        ]);

        const { initial_rated, rated, user_id } = result[0];

        if (initial_rated !== rated) {
          await this.commentRepository.query(
            `
            UPDATE posts_comments
            SET rating = rating + $1
            WHERE id = $2
            `,
            [rate, targetId],
          );

          await this.usersRepository.query(
            `
            UPDATE users
            SET rating = rating + $1
            WHERE id = $2
            `,
            [rate, user_id],
          );
        }
      }

      return {
        data: null,
        error: false,
        message: 'Rated Successfully !',
      };
    } catch (error) {
      throw error;
    }
  }
}
