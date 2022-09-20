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
import { ReactionsEntityBase } from './entity/reactions.entity';
import { AuthService } from 'src/auth/auth.service';
import { CommentsEntityBase } from './entity/comments.entity';
import { CommentsReactionsEntityBase } from './entity/comments.reactions.entity';
import { SubscribeGroupEntityBase } from './entity/subscribe.group.entity';
import { GroupsService } from '../groups/groups.service';
import { GroupsEntityBase } from '../groups/entity/groups.entity';
import { PostsEntityBase } from '../posts/entity/posts.entity';
import { UserFollowEntitiyBase } from './entity/user.following.entity';
import { ReactionsDto } from './dto/reactions.dto';
import { BlockedEntityBase } from './entity/blocked.entity';
import { ReplyCommentDto } from './dto/comment.dto';
import { CommentDto } from './dto/comment.one.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntityBase)
    private usersRepository: Repository<UsersEntityBase>,
    @InjectRepository(BlockedEntityBase)
    private blockedListRepository: Repository<BlockedEntityBase>,
    @InjectRepository(ReactionsEntityBase)
    private postsReactionRepository: Repository<ReactionsEntityBase>,
    @InjectRepository(PostsEntityBase)
    private postsRepository: Repository<PostsEntityBase>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(CommentsEntityBase)
    private commentRepository: Repository<CommentsEntityBase>,
    @InjectRepository(CommentsReactionsEntityBase)
    private commentReactionRepository: Repository<CommentsReactionsEntityBase>,
    @InjectRepository(UserFollowEntitiyBase)
    private userFollowRepository: Repository<UserFollowEntitiyBase>,
    @InjectRepository(SubscribeGroupEntityBase)
    private subscribeGroupRepository: Repository<SubscribeGroupEntityBase>,
    @Inject(GroupsService)
    private readonly groupsService: GroupsService,
    @InjectRepository(PostsEntityBase)
    private readonly postRepository: Repository<PostsEntityBase>,
  ) {}

  // get me
  async getMe(request: any) {
    try {
      const userAuth = await this.authService.verifyToken(request);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      return { userAuth };
    } catch (error) {
      Logger.log('error=> get me function ', error);
      throw error;
    }
  }

  // get user by Id
  async getUserById(id: number, request: any) {
    try {
      const userAuth = await this.authService.verifyToken(request);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const user = await this.usersRepository.findOne({ where: { id } });
      if (!user) {
        Logger.log('id is not defined!!');
        throw new NotFoundException('User does not exist!!!');
      }
      return {
        data: {
          id: user.id,
          nicname: user.nicname,
          email: user.email,
        },
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

  // delete user whit Id
  async deleteUserWhitId(id: number, requset: any) {
    try {
      const userAuth = await this.authService.verifyToken(requset);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const user = await this.getUserById(id, requset);
      if (!user) {
        Logger.log('user does not exist!!');
        throw new BadRequestException('User is not exist!!! ');
      }
      await this.usersRepository.delete(id);
      return {
        data: null,
        message: 'User has been deleted!',
        success: true,
      };
    } catch (error) {
      Logger.log('error=> delete user whit Id function!!', error);
      throw error;
    }
  }

  //react post
  async reactPost(body: ReactionsDto, request: any) {
    try {
      const userAuth = await this.authService.verifyToken(request);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }

      const post = await this.postRepository.findOne({
        where: { id: body.postId },
      });
      if (!post) {
        throw new NotFoundException('Post is not exist!!!');
      }

      const ifReacted = await this.postsReactionRepository.findOne({
        where: { userId: userAuth.id },
      });
      if (ifReacted !== null) {
        if (ifReacted.reactionType == body.reactionType) {
          return {
            data: null,
            error: false,
            message: 'Your reaction was already counted',
          };
        }
      }
      // const data = { userId, postId, reactionType };
      const reacted = await this.postsReactionRepository.upsert(
        {
          userId: userAuth.id,
          postId: body.postId,
          reactionType: body.reactionType,
        },
        {
          conflictPaths: ['user_id', 'post_id'],
          skipUpdateIfNoValuesChanged: true,
        },
      );
      const reactionsCount = await this.postsRepository
        .createQueryBuilder()
        .update(this.postsRepository)
        .set({ rating: () => `rating + ${body.reactionType}` });
      if (!reacted) throw new Error('Reaction was not Counted');
      return reacted;
    } catch (error) {
      Logger.log('error=> react post function!!', error);
      throw error;
    }
  }

  async commentPost(body: CommentDto, request: any) {
    try {
      const userAuth = await this.authService.verifyToken(request);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const post = await this.postRepository.findOne({
        where: { id: body.postId },
      });
      if (!post) {
        throw new NotFoundException('Post is not exist!!!');
      }
      const commented = await this.commentRepository.save(
        this.commentRepository.create({
          userId: userAuth.id,
          postId: body.postId,
          comment: body.comment,
        }),
      );
      return {
        data: commented,
        error: false,
        message: `commented successfully`,
      };
    } catch (error) {
      Logger.log('error=> create comment function!!', error);
      throw error;
    }
  }

  async replyCommentPost(body: ReplyCommentDto, request: any) {
    try {
      const userAuth = await this.authService.verifyToken(request);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const post = await this.postRepository.findOne({
        where: { id: body.postId },
      });
      if (!post) {
        throw new NotFoundException('Post is not exist!!!');
      }
      const commented = await this.commentRepository.save(
        this.commentRepository.create({
          userId: userAuth.id,
          postId: body.postId,
          parentCommentId: body.parrentCommentId,
          comment: body.comment,
        }),
      );
      return {
        data: commented,
        error: false,
        message: `commented successfully`,
      };
    } catch (error) {
      Logger.log('error=> create comment function!!', error);
      throw error;
    }
  }

  async reactComment(body: any, request: any) {
    try {
      const userAuth = await this.authService.verifyToken(request);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const { userId, commentId, reactionType } = body;
      const ifReacted = await this.commentReactionRepository.findOne({
        where: { userId: userId },
      });
      if (ifReacted !== null) {
        if (ifReacted.reactionType == reactionType) {
          return {
            data: null,
            error: false,
            message: 'Your reaction was already counted',
          };
        }
      }
      const reacted = await this.commentReactionRepository.upsert(
        {
          userId: userId,
          commentId: commentId,
          reactionType: reactionType,
        },
        {
          conflictPaths: ['user_id', 'comment_id'],
          skipUpdateIfNoValuesChanged: true,
        },
      );
      if (!reacted) throw new Error('Reaction was not Counted');
      return reacted;
    } catch (error) {
      Logger.log('error=> react post function!!', error);
      throw error;
    }
  }

  // subscribe users to group
  async subscribeGroup(groupId: number, request: any) {
    try {
      const user: UsersEntityBase = await this.authService.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const group: GroupsEntityBase = await this.groupsService.getGroupById(
        groupId,
      );
      if (!group) {
        throw new BadRequestException('Group is not exist!!!');
      }
      if (user.id === group.user) {
        throw new BadRequestException(
          'This user is the creator of the group and he cannot subscribe.',
        );
      }

      const isSubscribe = await this.subscribeGroupRepository.find({
        where: { userId: user.id, groupId: groupId },
      });

      if (isSubscribe[0]) {
        throw new BadRequestException('User already subscribed!!!');
      }
      const subscribe: SubscribeGroupEntityBase =
        await this.subscribeGroupRepository.save(
          this.subscribeGroupRepository.create({
            userId: user.id,
            groupId: groupId,
          }),
        );
      return { data: subscribe, error: false, message: 'User is subscribed.' };
    } catch (error) {
      Logger.log('error=> subscribe group function', error);
      throw error;
    }
  }

  // unsigned users to group
  async unsignedGroup(groupId: number, request: any) {
    try {
      const user: UsersEntityBase = await this.authService.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const group: GroupsEntityBase = await this.groupsService.getGroupById(
        groupId,
      );
      if (!group) {
        throw new BadRequestException('Group is not exist!!!');
      }
      if (user.id === group.user) {
        throw new BadRequestException('This user is not subscribed.');
      }
      const isSubscribe: SubscribeGroupEntityBase[] =
        await this.subscribeGroupRepository.find({
          where: { userId: user.id, groupId: groupId },
        });

      if (!isSubscribe[0]) {
        throw new BadRequestException('User is not subscribed!!!');
      }
      await this.subscribeGroupRepository.delete(isSubscribe[0].id);
      return { data: null, error: false, message: 'User is unsigned.' };
    } catch (error) {
      Logger.log('error=> UNsubscribe group function ', error);
      throw error;
    }
  }

  async unfollowUser(userId: number, followToId: number) {
    try {
      const unFollowed = this.userFollowRepository
        .createQueryBuilder()
        .delete()
        .where(`userId = ${userId} && followToId = ${followToId}`)
        .execute();
      if (!unFollowed) {
        return {
          data: null,
          error: false,
          message: "User doesn't follow to user you want to unfollow from",
        };
      }
      return { data: null, error: false, message: 'Successfully Unfollowed' };
    } catch (error) {
      Logger.log('error=> Unfollow group function ', error);
      throw error;
    }
  }

  async followUser(userId: number, followToId: number) {
    try {
      const followUser = this.userFollowRepository.save(
        this.userFollowRepository.create({
          userId: userId,
          followToId: followToId,
        }),
      );
      return {
        data: followUser,
        error: false,
        message: 'Successfully Followed',
      };
    } catch (error) {
      Logger.log('error=> follow user function ', error);
      throw error;
    }
  }

  async getFeed(param: string, body: any) {
    try {
      let feed;
      let actual = '';
      if (body.actual === true) actual = 'created_date';
      const userId = body.id;
      if (param === 'new') {
        feed = this.postsRepository
          .createQueryBuilder('Posts')
          .orderBy('created_date', 'DESC');
      }
      if (param === 'top') {
        feed = this.postsRepository
          .createQueryBuilder('Posts')
          .orderBy('rating', 'DESC')
          .addOrderBy(`${actual}, 'DESC'`);
      }
      //need to maintain--------------------------------------
      if (param === 'myFeed') {
        const followings = this.userFollowRepository
          .createQueryBuilder('user_following')
          .where(`user_id = ${userId}`);
        feed = this.postsRepository
          .createQueryBuilder('Posts')
          .where(`created_by IN ${followings}`)
          .orderBy('created_date', 'DESC');
      }
      //------------------------------------------------------
      return { data: feed, error: false, message: 'User is unsigned.' };
    } catch (error) {
      Logger.log('error=> Get feed function ', error);
      throw error;
    }
  }

  // new pushing --------------

  // blocked user
  async toBlockedUser(blockedUserId: number, request: any) {
    try {
      const user: UsersEntityBase = await this.authService.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      //blockedListRepository
      const blocking = await this.blockedListRepository.save(
        this.blockedListRepository.create({
          blockingUserId: user.id,
          blockedUser: blockedUserId,
        }),
      );
      return {
        data: blocking,
        error: false,
        message: `user ${user.nicname} bloked user whit ${blockedUserId} id!`,
      };
    } catch (error) {
      Logger.log('error=> blocked user function ', error);
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
        .where('blockingUserId = :blockingUserId', { blockingUserId: user.id })
        .andWhere('blockedUser = :blockedUser', {
          blockedUser: unblockedUserId,
        })
        .execute();
      return {
        data: null,
        error: false,
        message: `user ${user.nicname} unbloked user whit ${unblockedUserId} id!`,
      };
    } catch (error) {
      Logger.log('error=> unblocked user function ', error);
      throw error;
    }
  }

  // get my blocked list
  async getBlockedList(request: any) {
    try {
      const user: UsersEntityBase = await this.authService.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const blockedList = await this.blockedListRepository.find({
        where: { blockingUserId: user.id },
      });

      console.log(blockedList);

      return blockedList;
    } catch (error) {
      Logger.log('get blocked list function ', error);
      throw error;
    }
  }
}
