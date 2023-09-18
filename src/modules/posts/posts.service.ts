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
import { CreatePostBodyDto } from './dto/create.post.body.dto';
import { FilterSearchDto } from './dto/filter.search.dto';
import { FavoritsEntityBase } from './entity/favorite.post.entity';
import { PostsEntityBase } from './entity/posts.entity';
import { PostReactionEntityBase } from './entity/post.reactions.entity';
import { TagsService } from '../tags/tags.service';
import { UploadFileEntityBase } from './upload_file/entity/upload_file.entity';
import { UploadFileService } from './upload_file/upload_file.service';
import { TagsPostEntityBase } from '../tags/entity/tags.for.posts.entity';
import { TagsNameEntityBase } from '../tags/entity/tags.name.entity';
import { AddToGroupDto } from './dto/add.to.group.dto';
import { GroupsEntityBase } from '../groups/entity/groups.entity';
import { PostsToGroupEntityBase } from './entity/group.post.entity';
import { PagedSearchDto } from 'src/shared/dto/paged.search.dto';
import { ReactPostDto } from './dto/react.post.dto';
import { PostReactions } from 'src/shared/types/reactions';
import { GetCommentsDto } from './dto/getComments.dto';
import { CommentsEntityBase } from '../users/entity/comments.entity';
import { GetRepliesDto } from './dto/getReplies.dto';
import { Utils } from 'src/shared/utils/utils';
import { PostReactionCountEntityBase } from './entity/posts.reactions.count.entity';
import { GetReactionsList } from './dto/getReactionList.dto';
import { AddToFAvoritesDto } from './dto/add.to.favorites.dto';
import { Paginate } from '../users/dto/paginate.dto';
import { RatePostEntityBase } from '../users/entity/posts.rate.entity';
import { RateCommentEntityBase } from '../users/entity/comments.rate.entity';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntityBase)
    private postsRepository: Repository<PostsEntityBase>,
    @InjectRepository(CommentsEntityBase)
    private commentRepository: Repository<CommentsEntityBase>,
    @InjectRepository(RatePostEntityBase)
    private readonly ratePostEntityBase: Repository<RatePostEntityBase>,
    @InjectRepository(PostReactionEntityBase)
    private postReactionEntityBase: Repository<PostReactionEntityBase>,
    @InjectRepository(GroupsEntityBase)
    private groupsRepository: Repository<GroupsEntityBase>,
    @InjectRepository(TagsPostEntityBase)
    private tagsPostRepository: Repository<TagsPostEntityBase>,
    @InjectRepository(TagsNameEntityBase)
    @InjectRepository(UploadFileEntityBase)
    private uploadFileRepository: Repository<UploadFileEntityBase>,
    @InjectRepository(FavoritsEntityBase)
    private favoritesRepository: Repository<FavoritsEntityBase>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly uploadFileService: UploadFileService,
    private readonly tagsService: TagsService,
    @InjectRepository(PostsToGroupEntityBase)
    private postToGroupRepository: Repository<PostsToGroupEntityBase>,
    @InjectRepository(CommentsEntityBase)
    private commentsEntityBase: Repository<CommentsEntityBase>,
    @InjectRepository(PostReactionCountEntityBase)
    private postReactionCountEntityBase: Repository<PostReactionCountEntityBase>,
    @InjectRepository(RateCommentEntityBase)
    private readonly rateCommentEntityBase: Repository<RateCommentEntityBase>,
    @Inject(NotificationsService)
    private readonly notifService: NotificationsService,
  ) {}

  // create post
  async createPost(data: CreatePostBodyDto) {
    try {
      if (data.community_id) {
        const communityIsTrue = await this.groupsRepository.findOne({
          where: { id: data.community_id },
        });
        if (!communityIsTrue) {
          throw new BadRequestException('Community is not exist.');
        }
      }
      const newPost = this.postsRepository.create({
        title: data.title,
        description: data.description,
        user: data.userId,
        community: data.community_id || null,
      });

      if (data.tags.length > 5 || data.tags.length < 3) {
        throw new BadRequestException('You must add from 3 to 5 tags !');
      }

      await this.postsRepository.save(newPost);
      await this.tagsService.addTagsForPost({
        postId: newPost.id,
        name: data.tags,
      });

      return { data: null, error: false, message: 'Its your new post.' };
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
        .leftJoinAndSelect('post.user', 'userEntity')
        .where({ id })
        .getOne();
      if (!post) {
        Logger.log('Post not exist!!!');
        throw new NotFoundException('Post not exist!');
      }

      if (post.user['id'] !== user.id) {
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
        .leftJoinAndSelect('posts.fileUrl', 'upload_fileId')
        .leftJoinAndSelect('upload_fileId.postId', 'uploadFile')
        .leftJoinAndSelect('posts.tagsEntity', 'tagsId')
        .leftJoinAndSelect('tagsId.tag', 'tagsName')
        .select([
          'posts.id',
          'posts.title',
          'upload_fileId',
          'tagsId.id',
          'tagsName.name',
          'tagsName.id',
        ])
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

  async getPostById(id: number, body) {
    try {
      const { userId } = body;
      const post: any = await this.postsRepository
        .createQueryBuilder('post')
        .leftJoinAndSelect('post.user', 'user')
        .select([
          'post.id',
          'post.title',
          'post.description',
          'post.fileUrl',
          'post.rating',
          'post.commentsCount',
          'post.createdAt',
          'user.id',
          'user.nickname',
          'user.profilePhotoUrl',
        ])
        .where({ id })
        .getOne();

      if (!post) throw new BadRequestException('No Such Post !');

      post.user.profilePhotoUrl ? Utils.generateS3Url(post.user, 1) : null;

      const reactions = await this.postReactionCountEntityBase
        .createQueryBuilder('postReactions')
        .select(['postReactions.reaction', 'postReactions.count'])
        .where({ post: post.id })
        .getMany();

      post.reactionsCount = reactions.reduce((sum, obj) => sum + obj.count, 0);

      post.commentsCount = await this.commentRepository
        .createQueryBuilder('postComments')
        .select(['postComments.id'])
        .where({ post: post.id })
        .getCount();

      post.rated =
        (
          await this.ratePostEntityBase
            .createQueryBuilder('ratedPost')
            .select(['ratedPost.rated'])
            .where(
              `post_id=${post.id} ${userId ? 'AND user_id=' + userId : ''}  `,
            )
            .getOne()
        )?.rated || 0;

      post.createdAt = Utils.generateDateInMs(post.createdAt); // convert Date to miliseconds

      return {
        data: post,
        error: false,
        message: `Post Data Recieved !`,
      };
    } catch (error) {
      Logger.log('Error While Getting Post Data', error);
      throw error;
    }
  }

  async addPostToFavorites(body: AddToFAvoritesDto) {
    const { postId, userId } = body;
    try {
      await this.favoritesRepository
        .createQueryBuilder()
        .insert()
        .into(FavoritsEntityBase)
        .values([{ post: postId, user: userId }])
        .execute();

      return {
        data: null,
        error: false,
        message: 'Post added to favorites !',
      };
    } catch (error) {
      Logger.log('error=> add post to favorites function ', error);
      throw error;
    }
  }

  async getFavorites(body: any, query: Paginate) {
    const { limit, offset } = query;
    const { userId } = body;
    try {
      const favs: any = await this.favoritesRepository
        .createQueryBuilder('favorites')
        .leftJoinAndSelect('favorites.post', 'post')
        .leftJoinAndSelect('post.user', 'user')
        .select([
          'favorites.createdAt',
          'post.id',
          'post.title',
          'post.description',
          'post.fileUrl',
          'post.rating',
          'post.commentsCount',
          'post.createdAt',
          'user.id',
          'user.nickname',
          'user.profilePhotoUrl',
        ])
        .where({ user: userId })
        .limit(limit)
        .offset(offset)
        .orderBy('favorites.createdAt', 'DESC')
        .getMany();

      const transformedArray = [];

      for (const item of favs) {
        item.post.profilePhotoUrl ? Utils.generateS3Url(item.post, 1) : null;

        const reactions = await this.postReactionCountEntityBase
          .createQueryBuilder('postReactions')
          .select(['postReactions.reaction', 'postReactions.count'])
          .where({ post: item.postid })
          .getMany();

        item.post.reactionsCount = reactions.reduce(
          (sum, obj) => sum + obj.count,
          0,
        );

        item.post.commentsCount = await this.commentRepository
          .createQueryBuilder('postComments')
          .select(['postComments.id'])
          .where({ post: item.post.id })
          .getCount();

        item.post.rated =
          (
            await this.ratePostEntityBase
              .createQueryBuilder('ratedPost')
              .select(['ratedPost.rated'])
              .where(
                `post_id=${item.post.id} ${
                  userId ? 'AND user_id=' + userId : ''
                }  `,
              )
              .getOne()
          )?.rated || 0;

        item.post.favorite = true;
        item.post.createdAt = Utils.generateDateInMs(item.post.createdAt); // convert Date to miliseconds
        transformedArray.push(item.post);
      }

      return {
        data: transformedArray,
        error: false,
        message: 'Favorits List Recieved Successfully !',
      };
    } catch (error) {
      Logger.log('error=> add post to favorites function ', error);
      throw error;
    }
  }

  async deleteFromFavorites(body: AddToFAvoritesDto) {
    const { postId, userId } = body;
    try {
      await this.favoritesRepository
        .createQueryBuilder()
        .delete()
        .from(FavoritsEntityBase)
        .where({ user: userId, post: postId })
        .execute();

      return {
        data: null,
        error: false,
        message: 'Post deleted from favorites !',
      };
    } catch (error) {
      Logger.log('error=> delete post from favorites ', error);
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
      if (post.user !== user.id) {
        throw new UnauthorizedException('User is not authorized!!!');
      }
      const postToGroup = await this.postToGroupRepository.save(
        this.postToGroupRepository.create({
          postId: data.postId,
          groupId: data.groupId,
        }),
      );

      const community = await this.groupsRepository.findOne({
        where: { id: data.groupId },
      });

      await this.groupsRepository.update(
        { id: data.groupId },
        { posts_count: community.posts_count + 1 },
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
  async searchByTitlePost(query: FilterSearchDto) {
    try {
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

  async searchByTagsPost(query: FilterSearchDto) {
    try {
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
  async searchByAttachmentsPost(query: FilterSearchDto) {
    try {
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
        .getManyAndCount();
      return {
        data: { result, count },
        error: false,
        message: 'get same post.',
      };
    } catch (error) {
      Logger.log('get same posts function ', error);
      throw error;
    }
  }

  async getPostsByUserId(query: PagedSearchDto, userId: number) {
    try {
      const posts = await this.postsRepository
        .createQueryBuilder('post')
        .innerJoinAndSelect('post.tagsEntity', 'tags')
        .leftJoinAndSelect('tags.tag', 'tagName')
        .limit(query.limit)
        .offset(query.offset)
        .where({ user: userId })
        .getMany();
      return posts;
    } catch (error) {
      Logger.log('get posts by user ID function ', error);
      throw error;
    }
  }

  async reactPost(body: ReactPostDto) {
    const { postId, reactionId, userId } = body;
    try {
      const exists = await this.postReactionEntityBase
        .createQueryBuilder('postUserReactions')
        .select(['postUserReactions.id', 'postUserReactions.reaction'])
        .where({ post: postId, user: userId })
        .getOne();

      const post: any = await this.postsRepository.findOne({
        where: { id: postId },
        relations: ['user'],
      });

      if (exists?.id && exists.reaction == reactionId) {
        await this.postReactionEntityBase.delete({
          id: exists.id,
        });

        await this.notifService.deleteNotification(post.user.id, 4, {
          relatedPost: postId,
          relatedUser: userId,
        });

        this.postReactionEntityBase
          .createQueryBuilder()
          .update(PostReactionCountEntityBase)
          .set({
            count: () => '"count" - 1',
          })
          .where('id = :id', { id: exists.id })
          .andWhere('"count" > 0')
          .execute();
        return {
          data: null,
          error: false,
          message: `UnReacted the ${PostReactions[reactionId]}!`,
        };
      }

      await this.postReactionEntityBase
        .createQueryBuilder()
        .insert()
        .values([{ user: userId, post: postId, reaction: reactionId }])
        .orUpdate(['reaction_id'], ['user_id', 'post_id'])
        .execute();

      if (!exists) {
        await this.postReactionCountEntityBase
          .query(`INSERT INTO posts_reactions_count (reaction,post_id,count) 
          VALUES (${reactionId},${postId}, 1) ON CONFLICT(reaction,post_id) DO UPDATE SET count=posts_reactions_count.count+1`);
      }

      await this.notifService.sendAndSaveNotification(post.user.id, 4, {
        relatedPost: postId,
        relatedUser: userId,
      });

      return {
        data: null,
        error: false,
        message: `Reacted as ${PostReactions[reactionId]}!`,
      };
    } catch (error) {
      Logger.log('Error reacting the post !', error);
      throw error;
    }
  }

  async getReactionsList(query: GetReactionsList) {
    const { reactionId, postId, limit, offset } = query;
    const counts = [];
    try {
      const reactionsList: any =
        reactionId == -1
          ? await this.postReactionEntityBase
              .createQueryBuilder('postReactions')
              .leftJoinAndSelect('postReactions.user', 'user')
              .where({ post: postId })
              .select([
                'postReactions.reaction',
                'postReactions.createdAt',
                'user.id',
                'user.nickname',
                'user.profilePhotoUrl',
              ])
              .limit(limit)
              .offset(offset)
              .orderBy('postReactions.created_date', 'DESC')
              .getMany()
          : await this.postReactionEntityBase
              .createQueryBuilder('postReactions')
              .leftJoinAndSelect('postReactions.user', 'user')
              .where({ post: postId })
              .select([
                'postReactions.reaction',
                'postReactions.createdAt',
                'user.id',
                'user.nickname',
                'user.profilePhotoUrl',
              ])
              .andWhere({ reaction: reactionId })
              .limit(limit)
              .offset(offset)
              .orderBy('postReactions.created_date', 'DESC')
              .getMany();

      for (const reaction of reactionsList) {
        reaction.createdAt = Utils.generateDateInMs(reaction.createdAt);
        reaction.user.profilePhotoUrl
          ? Utils.generateS3Url(reaction.user, 1)
          : null;
      }

      for (let reaction = -1; reaction < 9; reaction++) {
        const reactCount = await this.postReactionEntityBase
          .createQueryBuilder('postReactions')
          .where(`${reaction == -1 ? '' : 'reaction_id = ' + reaction}`)
          .select(['postReactions.id'])
          .getCount();

        counts.push({
          reactionId: reaction,
          count: reactCount,
        });
      }

      return {
        data: { reactionsList, counts },
        error: false,
        message: `Reactions recieved successfully !`,
      };
    } catch (error) {
      Logger.log('Error getting reactions counts !', error);
      throw error;
    }
  }

  async getComments(query: GetCommentsDto, body) {
    const { postId, limit, offset } = query;
    const { userId } = body;
    try {
      const comments: any = await this.commentsEntityBase
        .createQueryBuilder('postComments')
        .leftJoinAndSelect('postComments.user', 'user')
        .where({ post: postId })
        .select('postComments')
        .addSelect(['user.id', 'user.nickname', 'user.profilePhotoUrl'])
        .andWhere('postComments.parent_comment_id IS NULL')
        .limit(limit)
        .offset(offset)
        .orderBy('postComments.created_date', 'DESC')
        .getMany();

      for (const comment of comments) {
        comment.repliesCount = await this.commentsEntityBase
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
        message: `Comments recieved successfully !`,
      };
    } catch (error) {
      Logger.log('Error reacting the post !', error);
      throw error;
    }
  }

  async getReplies(query: GetRepliesDto, body) {
    const { parentCommentId, limit, offset } = query;
    const { userId } = body;
    try {
      const replies: any = await this.commentsEntityBase
        .createQueryBuilder('postReplies')
        .leftJoinAndSelect('postReplies.user', 'user')
        .where({ parentCommentId })
        .select('postReplies')
        .addSelect(['user.id', 'user.nickname', 'user.profilePhotoUrl'])
        .limit(limit)
        .offset(offset)
        .orderBy('postReplies.created_date', 'DESC')
        .getMany();

      for (const reply of replies) {
        const ifRated = await this.rateCommentEntityBase
          .createQueryBuilder('ratedReply')
          .select(['ratedReply.rated'])
          .where(
            `comment_id=${reply.id} ${userId ? 'AND user_id=' + userId : ''}  `,
          )
          .getOne();

        reply.rated = ifRated ? ifRated.rated : 0;

        delete reply.updatedAt;
        reply.createdAt = Utils.generateDateInMs(reply.createdAt);
        reply.user.profilePhotoUrl ? Utils.generateS3Url(reply.user, 1) : null;
      }

      return {
        data: replies,
        error: false,
        message: `Replies recieved successfully !`,
      };
    } catch (error) {
      Logger.log('Error reacting the post !', error);
      throw error;
    }
  }
}
