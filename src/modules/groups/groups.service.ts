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
import { PostsToGroupEntityBase } from '../posts/entity/group.post.entity';
// import { TagsEntityBase } from '../posts/tags/entity/tags.entity';
import { TagsService } from '../tags/tags.service';
import { SubscribeGroupEntityBase } from '../users/entity/subscribe.group.entity';
import { UsersEntityBase } from '../users/entity/users.entity';
import { CreateGroupDto } from './dto/create.group.dto';
import { GroupsEntityBase } from './entity/groups.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupsEntityBase)
    private readonly groupsRepository: Repository<GroupsEntityBase>,
    @InjectRepository(SubscribeGroupEntityBase)
    private readonly groupsSubscribeRepository: Repository<SubscribeGroupEntityBase>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    @Inject(forwardRef(() => TagsService))
    private readonly tagsService: TagsService,
    @InjectRepository(PostsToGroupEntityBase)
    private postsToGroupsRepository: Repository<PostsToGroupEntityBase>,
  ) {}

  async createGroup(data: CreateGroupDto, request: any) {
    try {
      const validUrl = await this.groupsRepository.findOne({
        where: { url: data.url },
      });
      if (validUrl) {
        throw new BadRequestException('url is exist!!!');
      }
      const user = await this.authService.verifyToken(request);
      if (!user) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const newGroup = this.groupsRepository.create({
        title: data.title,
        attachment: data.attachment,
        url: data.url,
        user: user.id,
      });

      if (data.tags.length <= 10 && data.tags.length >= 3) {
        await this.groupsRepository.save(newGroup);
        await this.tagsService.addTagsForGroup({
          groupId: newGroup.id,
          name: data.tags,
        });
      } else {
        throw new BadRequestException(
          'Tags length is not defined, minimum length is 3, maximum length is 10!!!',
        );
      }

      return {
        data: { title: newGroup.title, attachment: newGroup.attachment },
        error: false,
        message: 'Create new group.',
      };
    } catch (error) {
      Logger.log('error=> create group function ', error);
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
  async getGroup(id: number) {
    try {
      const group = await this.groupsRepository
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.postToGroupEntity', 'postsToGroups')
        .leftJoinAndSelect('postsToGroups.postId', 'posts')
        .leftJoinAndSelect('group.tagsEntity', 'tagsId')
        .leftJoinAndSelect('tagsId.tag', 'nameTags')
        .where('group.id = :id', { id })
        .getOne();

      if (!group) {
        throw new NotFoundException('Group is not defined!!!');
      }
      return { data: group, error: false, message: 'this is a group' };
    } catch (error) {
      Logger.log('error=> get group by Id function ', error);
      throw error;
    }
  }

  async getGroups(query: FilterSearchDto) {
    try {
      const [result, count] = await this.groupsRepository
        .createQueryBuilder('group')
        .leftJoin('group.postToGroupEntity', 'postsToGroups')
        .leftJoinAndSelect('postsToGroups.postId', 'posts')
        // .andWhere('group.id = :id', {})
        .limit(query.limit)
        .offset(query.offset)
        .orderBy('group.createdAt', 'DESC')
        .where(`lower("group"."title") LIKE lower('${query.beginning || ''}%')`)
        .getManyAndCount();
      return {
        data: { result, count },
        error: false,
        message: 'groups filter',
      };
    } catch (error) {
      Logger.log('error=> get groups function ', error);
      throw error;
    }
  }

  // filter group
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
}
