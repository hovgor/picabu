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
import { ReactionsDto } from './dto/reactions.dto';
import { PostsEntityBase } from '../posts/entity/posts.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntityBase)
    private usersRepository: Repository<UsersEntityBase>,
    @InjectRepository(ReactionsEntityBase)
    private reactionsRepository: Repository<ReactionsEntityBase>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @InjectRepository(CommentsEntityBase)
    private commentRepository: Repository<CommentsEntityBase>,
    @InjectRepository(CommentsReactionsEntityBase)
    private commentReactionRepository: Repository<CommentsReactionsEntityBase>,
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
        throw new NotFoundException('Post is not defined!!!');
      }

      const { postId, reactionType } = body;
      const ifReacted = await this.reactionsRepository.findOne({
        where: { user_id: userAuth.id },
      });
      if (ifReacted !== null) {
        if (ifReacted.reaction_type == reactionType) {
          return {
            data: null,
            error: false,
            message: 'Your reaction was already counted',
          };
        }
      }
      const reacted = await this.reactionsRepository.upsert(
        { user_id: userAuth.id, post_id: postId, reaction_type: reactionType },
        {
          conflictPaths: ['user_id', 'post_id'],
          skipUpdateIfNoValuesChanged: true,
        },
      );
      if (!reacted) throw new Error('Reaction was not Counted');
      let count = post.like;
      count += body.reactionType;
      await this.postRepository.update({ id: postId }, { like: count });
      if (post.like === -100) {
        await this.postRepository.delete(postId);
      }
      return reacted;
    } catch (error) {
      Logger.log('error=> react post function!!', error);
      throw error;
    }
  }

  async commentPost(body: any, request: any) {
    try {
      const userAuth = await this.authService.verifyToken(request);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const { userId, postId, comment } = body;
      const commented = await this.commentRepository.save(
        this.commentRepository.create({
          user_id: userId,
          post_id: postId,
          comment: comment,
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

  async replyCommentPost(body: any, request: any) {
    try {
      const userAuth = await this.authService.verifyToken(request);
      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const { userId, postId, commentId, comment } = body;
      const commented = await this.commentRepository.save(
        this.commentRepository.create({
          user_id: userId,
          post_id: postId,
          parent_comment_id: commentId,
          comment: comment,
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
        where: { user_id: userId },
      });
      if (ifReacted !== null) {
        if (ifReacted.reaction_type == reactionType) {
          return {
            data: null,
            error: false,
            message: 'Your reaction was already counted',
          };
        }
      }
      const reacted = await this.commentReactionRepository.upsert(
        {
          user_id: userId,
          comment_id: commentId,
          reaction_type: reactionType,
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
      Logger.log('error=> subscribe group function ', error);
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
      Logger.log('error=> subscribe group function ', error);
      throw error;
    }
  }
}
