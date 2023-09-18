import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GroupsEntityBase } from 'src/modules/groups/entity/groups.entity';
import { FilterSearchDto } from 'src/modules/posts/dto/filter.search.dto';
import { PostsEntityBase } from 'src/modules/posts/entity/posts.entity';
import { UserFollowRequestEntitiyBase } from 'src/modules/users/entity/follow.request.entity';
import { UserFollowEntitiyBase } from 'src/modules/users/entity/user.following.entity';
import { Utils } from 'src/shared/utils/utils';
import { UsersEntityBase } from 'src/modules/users/entity/users.entity';
import { Repository } from 'typeorm';
import { PostReactionCountEntityBase } from 'src/modules/posts/entity/posts.reactions.count.entity';
import { CommentsEntityBase } from 'src/modules/users/entity/comments.entity';
import { RatePostEntityBase } from 'src/modules/users/entity/posts.rate.entity';
import { CommunitiesTargetsDto } from 'src/modules/groups/dto/get.communities.dto';
import { SubscribeGroupEntityBase } from 'src/modules/users/entity/subscribe.group.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(UsersEntityBase)
    private readonly usersRepository: Repository<UsersEntityBase>,

    @InjectRepository(PostsEntityBase)
    private readonly postsRepository: Repository<PostsEntityBase>,

    @InjectRepository(GroupsEntityBase)
    private readonly groupsRepository: Repository<GroupsEntityBase>,

    @InjectRepository(UserFollowEntitiyBase)
    private userFollowRepository: Repository<UserFollowEntitiyBase>,

    @InjectRepository(UserFollowRequestEntitiyBase)
    private readonly followRequestRepository: Repository<UserFollowRequestEntitiyBase>,

    @InjectRepository(PostReactionCountEntityBase)
    private postReactionCountRepository: Repository<PostReactionCountEntityBase>,

    @InjectRepository(CommentsEntityBase)
    private commentRepository: Repository<CommentsEntityBase>,

    @InjectRepository(RatePostEntityBase)
    private readonly ratePostRepository: Repository<RatePostEntityBase>,

    @InjectRepository(SubscribeGroupEntityBase)
    private readonly groupsSubscribeRepository: Repository<SubscribeGroupEntityBase>,
  ) {}

  async searchByTitlePost(query: FilterSearchDto, body: any) {
    try {
      const { userId } = body;
      const posts: any = await this.postsRepository
        .createQueryBuilder('posts')
        .leftJoinAndSelect('posts.user', 'users')
        .select([
          'posts.id',
          'posts.title',
          'posts.description',
          'posts.rating',
          'posts.createdAt',
          'users.nickname',
          'users.id',
          'users.profilePhotoUrl',
          'users.privacy',
        ])
        .limit(query.limit)
        .offset(query.offset)
        .orderBy('posts.createdAt', 'DESC')
        .where(`lower("posts"."title") LIKE lower('${query.beginning || ''}%')`)
        .getMany();

      const transformedArray = [];

      for (const item of posts) {
        item.profilePhotoUrl ? Utils.generateS3Url(item, 1) : null;

        const reactions = await this.postReactionCountRepository
          .createQueryBuilder('postReactions')
          .select(['postReactions.reaction', 'postReactions.count'])
          .where({ post: item.postid })
          .getMany();

        item.reactionsCount = reactions.reduce(
          (sum, obj) => sum + obj.count,
          0,
        );

        item.commentsCount = await this.commentRepository
          .createQueryBuilder('postComments')
          .select(['postComments.id'])
          .where({ post: item.id })
          .getCount();

        item.rated =
          (
            await this.ratePostRepository
              .createQueryBuilder('ratedPost')
              .select(['ratedPost.rated'])
              .where(
                `post_id=${item.id} ${userId ? 'AND user_id=' + userId : ''}  `,
              )
              .getOne()
          )?.rated || 0;

        item.favorite = true;
        item.createdAt = Utils.generateDateInMs(item.createdAt); // convert Date to miliseconds
        transformedArray.push(item);
      }

      return {
        data: posts,
        error: false,
        message: 'this is a posts',
      };
    } catch (error) {
      Logger.log('error=> search posts function ', error);
      throw error;
    }
  }

  async searchUsersByNickname(query: FilterSearchDto, body: any) {
    try {
      const { userId } = body;
      const users: any = await this.usersRepository
        .createQueryBuilder('users')
        .select([
          'users.nickname',
          'users.id',
          'users.profilePhotoUrl',
          'users.privacy',
        ])
        .limit(query.limit)
        .offset(query.offset)
        .orderBy('users.createdAt', 'DESC')
        .where(
          `lower("users"."nickname") LIKE lower('${query.beginning || ''}%')`,
        )
        .getMany();

      for (const user of users) {
        if (userId) {
          user.followStatus = 0;

          const userFollowsAccount = await this.userFollowRepository
            .createQueryBuilder('follows')
            .where({
              user: userId,
              followTo: user.id,
            })
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
        data: users,
        error: false,
        message: 'this is users',
      };
    } catch (error) {
      Logger.log('error=> search users function ', error);
      throw error;
    }
  }

  async searchGroups(query: CommunitiesTargetsDto, body: any) {
    const { offset, limit, target, searchBy } = query;
    const { userId } = body;

    let result = [];
    switch (target) {
      case 'my':
        result = await this.groupsRepository
          .createQueryBuilder('group')
          .select(['group.id', 'group.name', 'group.profileImgUrl'])
          .where('group.user_id = :userId', { userId })
          .andWhere(`lower("group"."name") LIKE lower('${searchBy || ''}%')`)
          .limit(limit)
          .offset(offset)
          .orderBy('group.createdAt', 'DESC')
          .getMany();

        break;

      case 'joined':
        const joinedGroups = await this.groupsSubscribeRepository
          .createQueryBuilder('userCommunities')
          .leftJoinAndSelect('userCommunities.community', 'community')
          .select([
            'userCommunities.id',
            'community.id',
            'community.name',
            'community.profileImgUrl',
          ])
          .where('userCommunities.user = :userId', { userId })
          .andWhere(
            `lower("community"."name") LIKE lower('${searchBy || ''}%')`,
          )
          .limit(limit)
          .offset(offset)
          .orderBy('community.createdAt', 'DESC')
          .getMany();

        result = joinedGroups.map((joinedGroup) => joinedGroup.community);
        break;

      case 'all':
        const all = await this.groupsRepository
          .createQueryBuilder('group')
          .select(['group.id', 'group.name', 'group.profileImgUrl'])
          .where(`lower("group"."name") LIKE lower('${searchBy || ''}%')`)
          .limit(limit)
          .offset(offset)
          .orderBy('group.createdAt', 'DESC')
          .getMany();
        console.log(all);
        result = all;
        break;
    }

    result?.forEach((community) => {
      community.profileImgUrl ? Utils.generateS3Url(community, 2) : null;
    });

    return {
      data: result,
      error: false,
      message: 'All communities are got !',
    };
  }
  catch(error) {
    Logger.log('error=> get groups function ', error);
    throw error;
  }
}
