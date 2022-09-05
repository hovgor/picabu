import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Repository } from 'typeorm';
// import { TagsEntityBase } from '../posts/tags/entity/tags.entity';
import { TagsService } from '../posts/tags/tags.service';
import { UsersEntityBase } from '../users/entity/users.entity';
import { CreateGroupDto } from './dto/create.group.dto';
import { GroupsEntityBase } from './entity/groups.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupsEntityBase)
    private readonly groupsRepository: Repository<GroupsEntityBase>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly tagsService: TagsService,
  ) {}

  async createGroup(data: CreateGroupDto, request: any) {
    try {
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
        await this.tagsService.addTags({
          groupId: newGroup.id,
          name: data.tags,
        });
      } else {
        throw new BadRequestException('Tags length is not defined!!!');
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
}
