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
import { FilterSearchDto } from '../posts/dto/filter.search.dto';
import { TagsService } from '../tags/tags.service';
import { SubscribeGroupEntityBase } from '../users/entity/subscribe.group.entity';
import { UsersEntityBase } from '../users/entity/users.entity';
import { CreateGroupDto } from './dto/create.group.dto';
import { GroupsEntityBase } from './entity/groups.entity';
import { EditCommunityDto } from './dto/edit.commuity.dto';
import { AdminsForComunityEntityBase } from './entity/admins.entity';
import { CommunitiesTargetsDto } from './dto/get.communities.dto';
import { UserJoinedCommunitiesEntityBase } from './entity/userJoinedGroups.entity';
import { Utils } from 'src/shared/utils/utils';
import { UserFollowRequestEntitiyBase } from '../users/entity/follow.request.entity';
import { GetGroupPostsDto } from './dto/get_group_posts.dto';
import { PostsEntityBase } from '../posts/entity/posts.entity';
import { FavoritsEntityBase } from '../posts/entity/favorite.post.entity';
import { PostReactionCountEntityBase } from '../posts/entity/posts.reactions.count.entity';
import { TagsPostEntityBase } from '../tags/entity/tags.for.posts.entity';
import { CommentsEntityBase } from '../users/entity/comments.entity';
import { RatePostEntityBase } from '../users/entity/posts.rate.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupsEntityBase)
    private readonly groupsRepository: Repository<GroupsEntityBase>,
    @InjectRepository(UserJoinedCommunitiesEntityBase)
    // private readonly userCommunitiesRepository: Repository<UserJoinedCommunitiesEntityBase>,
    @InjectRepository(SubscribeGroupEntityBase)
    private readonly groupsSubscribeRepository: Repository<SubscribeGroupEntityBase>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => TagsService))
    private readonly tagsService: TagsService,
    @InjectRepository(AdminsForComunityEntityBase)
    private adminsForComunityRepository: Repository<AdminsForComunityEntityBase>,
    @InjectRepository(UserFollowRequestEntitiyBase)
    private readonly followRequestRepository: Repository<UserFollowRequestEntitiyBase>,
    @InjectRepository(PostsEntityBase)
    private readonly postsRepository: Repository<PostsEntityBase>,
    @Inject(Utils)
    private readonly utils: Utils,
    @InjectRepository(CommentsEntityBase)
    private commentRepository: Repository<CommentsEntityBase>,
    @InjectRepository(FavoritsEntityBase)
    private favoritesRepository: Repository<FavoritsEntityBase>,
    @InjectRepository(PostReactionCountEntityBase)
    private readonly postReactionCountEntityBase: Repository<PostReactionCountEntityBase>,
    @InjectRepository(RatePostEntityBase)
    private readonly ratePostEntityBase: Repository<RatePostEntityBase>,
    @InjectRepository(TagsPostEntityBase)
    private tagsPostRepository: Repository<TagsPostEntityBase>,
  ) {}

  async createGroup(data: CreateGroupDto) {
    const {
      admins,
      name,
      description,
      backgroundImgUrl,
      profileImgUrl,
      privacy,
      userId,
    } = data;
    try {
      const createdGroup: GroupsEntityBase | any = await this.groupsRepository
        .createQueryBuilder()
        .insert()
        .into(GroupsEntityBase)
        .values({
          name,
          description,
          backgroundImgUrl,
          profileImgUrl,
          privacy,
          user: userId,
        })
        .execute();

      await this.adminsForComunityRepository
        .createQueryBuilder()
        .insert()
        .into(AdminsForComunityEntityBase)
        .values(admins.map((user) => ({ group: createdGroup.raw[0].id, user })))
        .execute();

      if (data.tags?.length <= 10 && data.tags?.length >= 3) {
        await this.tagsService.addTagsForGroup({
          groupId: createdGroup.raw[0].id,
          name: data.tags,
        });
      } else {
        throw new BadRequestException(
          'Tags length is not defined, minimum length is 3, maximum length is 10!!!',
        );
      }

      return {
        data: null,
        error: false,
        message: 'Community Created.',
      };
    } catch (error) {
      Logger.log('error=> create group function ', error);
      throw error;
    }
  }

  async editCommunity(data: EditCommunityDto, request: any) {
    try {
      const user = await this.authService.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const id = data.communityId;
      await this.groupsRepository.update(
        { id: id },
        {
          name: data.name,
          description: data.description,
          backgroundImgUrl: data.backgroundImgUrl,
          profileImgUrl: data.profileImgUrl,
          privacy: data.privacy,
        },
      );

      if (data.tags.length <= 5 && data.tags.length >= 3) {
        await this.tagsService.addTagsForGroup({
          groupId: id,
          name: data.tags,
        });
      } else {
        throw new BadRequestException(
          'Tags length is not defined, minimum length is 3, maximum length is 5!!!',
        );
      }

      return {
        data: { title: data.name },
        error: false,
        message: 'Community updated.',
      };
    } catch (error) {
      Logger.log('error=> edit community function ', error);
      throw error;
    }
  }

  async deleteGroup(id: number, request: any) {
    try {
      const user: UsersEntityBase = await this.authService.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User not authorized!!!');
      }

      const group: GroupsEntityBase = await this.groupsRepository.findOne({
        where: { id },
      });
      if (!group) {
        throw new BadRequestException('Bad request, group does not exist!!!');
      }
      if (user.id !== group.user) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      await this.groupsRepository.delete(id);
      return {
        data: null,
        error: false,
        message: 'Group is deleted!!!',
      };
    } catch (error) {
      Logger.log('error=> delete group function ', error);
      throw error;
    }
  }

  async getGroupById(id: number) {
    try {
      return await this.groupsRepository.findOne({ where: { id } });
    } catch (error) {
      Logger.log('error=> get group by Id function ', error);
      throw error;
    }
  }

  async getGroup(communityId: number, userId: number) {
    try {
      const group: any = await this.groupsRepository
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.postToGroupEntity', 'postsToGroups')
        .leftJoin('group.user', 'user')
        .addSelect(['user.id'])
        .leftJoinAndSelect('postsToGroups.postId', 'posts')
        .leftJoinAndSelect('group.tagsEntity', 'tagsId')
        .leftJoinAndSelect('tagsId.tag', 'nameTags')
        .where({ id: communityId })
        .getOne();

      if (!group) {
        throw new NotFoundException('Group Does not exists !!!');
      }

      group.admin = false;
      const communityAdmins = await this.utils.getCommunityAdmins(group.id);
      const creator: any = {};
      Object.assign(creator, group.user);
      if (userId == creator.id || communityAdmins.includes(userId)) {
        group.admin = true;
      }

      group?.profileImgUrl ? Utils.generateS3Url(group, 2) : null;
      group?.backgroundImgUrl ? Utils.generateS3Url(group, 3) : null;

      if (!group.admin) {
        group.followStatus = 0;
        const userFollowsGroup = await this.groupsSubscribeRepository
          .createQueryBuilder('follows')
          .where({ user: userId, community: communityId })
          .select()
          .getOne();

        if (!userFollowsGroup) {
          const requested = await this.followRequestRepository
            .createQueryBuilder('requested')
            .where({ user: userId, followTo: communityId, target: 'community' })
            .select()
            .getOne();

          if (requested) group.followStatus = 1;
        } else if (userFollowsGroup) {
          group.followStatus = 2;
        }
      }
      return {
        data: {
          id: group.id,
          name: group.name,
          description: group.description,
          profileImgUrl: group.profileImgUrl,
          backgroundImgUrl: group.backgroundImgUrl,
          private: group.privacy,
          isAdmin: group.admin,
          follwoStatus: group.followStatus,
        },
        error: false,
        message: 'Community Data recieved !',
      };
    } catch (error) {
      Logger.log('error=> get group by Id function ', error);
      throw error;
    }
  }

  async getGroups(query: CommunitiesTargetsDto, body: any) {
    try {
      const { offset, limit, target, searchBy } = query;
      const { userId } = body;

      let result = [];
      switch (target) {
        case 'my':
          result = await this.groupsRepository
            .createQueryBuilder('group')
            .select(['group.id', 'group.name', 'group.profileImgUrl'])
            .where({ user: userId })
            .limit(limit)
            .offset(offset)
            .orderBy('group.createdAt', 'DESC')
            .where(`lower("group"."name") LIKE lower('${searchBy || ''}%')`)
            .getMany();

          break;

        case 'all':
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
      }

      result?.forEach((community) => {
        community.profileImgUrl ? Utils.generateS3Url(community, 2) : null;
      });

      return {
        data: result,
        error: false,
        message: 'All joined communities are got !',
      };
    } catch (error) {
      Logger.log('error=> get groups function ', error);
      throw error;
    }
  }

  async filterGroup(query: FilterSearchDto) {
    try {
      const group = await this.groupsRepository
        .createQueryBuilder('group')
        .limit(query.limit)
        .offset(query.offset)
        .orderBy('group.createdAt', 'DESC')
        .where(`lower("group"."title") LIKE lower('${query.beginning || ''}%')`)
        .getManyAndCount();
      return { data: group, error: false, message: 'filter group.' };
    } catch (error) {
      Logger.log('error=> filter group function ', error);
      throw error;
    }
  }

  async getGroupPosts(data: GetGroupPostsDto, request: any) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;
      const { limit, offset, status, groupId } = data;
      let feed: any;
      let orderCase: string;
      let excludedUsers: string | any[];
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
      AND "posts".community_id = ${groupId}
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
      AND "posts".community_id = ${groupId}
      ${
        user?.id && excludedUsers?.length
          ? `AND "posts"."user_id" NOT IN ( ${excludedUsers} ) `
          : ''
      }
      ${userCase} ORDER BY ${orderCase} DESC
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

      return { data: feed, error: false, message: 'Group posts!' };
    } catch (error) {
      Logger.log('error=> get group posts function ', error);
      throw error;
    }
  }

  async getGroupPosts2(data: GetGroupPostsDto, request: any) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;

      const { limit, offset, status, groupId } = data;
      const userToken = request.headers['authorization'];
      const user = userToken
        ? await this.authService.verifyToken(request)
        : null;
      let excludedUsers;

      if (user?.id) {
        const dontRecommend = await this.utils.dontRecommendList(user.id);
        const blockedList = await this.utils.validBlockUser(user.id);
        excludedUsers = [...new Set([...dontRecommend, ...blockedList])];
      }

      let orderCase = '';
      if (status === 'new') {
        orderCase = 'created_date';
      } else if (status === 'top') {
        orderCase = 'rating';
      }

      const feed = await newTopQuery(orderCase);

      async function newTopQuery(orderCase) {
        const userCase = user?.id
          ? `
          UNION
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
            AND "posts".community_id = ${groupId}
            ${
              user.id && excludedUsers.length
                ? `AND "posts"."user_id" NOT IN (${excludedUsers})`
                : ''
            }
            AND "posts"."user_id" IN (SELECT follow_to_id FROM user_following WHERE "user_id" = ${
              user.id
            })
          `
          : '';

        return await self.postsRepository.query(`
          SELECT
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
            AND "posts".community_id = ${groupId}
            ${
              user?.id && excludedUsers?.length
                ? `AND "posts"."user_id" NOT IN (${excludedUsers})`
                : ''
            }
            ${userCase}
          ORDER BY ${orderCase} DESC
          LIMIT ${limit} OFFSET ${offset}
        `);
      }

      const feedPromises = feed.map(async (post) => {
        Utils.generateResponseObj(post);
        post.profilePhotoUrl && Utils.generateS3Url(post, 1);

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

        const rated = await this.ratePostEntityBase
          .createQueryBuilder('ratedPost')
          .select(['ratedPost.rated'])
          .where(
            `post_id=${post.id} ${user?.id ? 'AND user_id=' + user.id : ''}`,
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
        post.createdDate = Utils.generateDateInMs(post.createdDate);

        post.user = {
          id: post.userId,
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

        delete post.userId;
        delete post.nickname;
        delete post.profilePhotoUrl;

        return post;
      });

      const feedResults = await Promise.all(feedPromises);

      return { data: feedResults, error: false, message: 'Group posts!' };
    } catch (error) {
      Logger.log('error => get group posts function ', error);
      throw error;
    }
  }
}
