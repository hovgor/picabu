import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { TOKEN_FOR_DEFAULT_TAGS } from 'src/shared/constants/token.for.default.tags';
import { Repository } from 'typeorm';
import { FilterSearchDto } from '../posts/dto/filter.search.dto';
import { defaultFunTags } from './defaultTags/default.fun.tag';
import { defaultRuTags } from './defaultTags/default.ru';
import { defaultUsTags } from './defaultTags/default.us';
import { AddTagDto } from './dto/add.tag.dto';
import { AddTagsDto } from './dto/add.tags.dto';
import { TagsGroupEntityBase } from './entity/tags.for.group.entity';
import { TagsPostEntityBase } from './entity/tags.for.posts.entity';
import { TagsNameEntityBase } from './entity/tags.name.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagsPostEntityBase)
    private tagsForPostRepository: Repository<TagsPostEntityBase>,
    @InjectRepository(TagsNameEntityBase)
    private tagsNameRepository: Repository<TagsNameEntityBase>,
    @InjectRepository(TagsGroupEntityBase)
    private tagsForGroupRepository: Repository<TagsGroupEntityBase>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async addTagsForGroup(data: AddTagsDto) {
    try {
      for (let i = 0; i < data.name.length; ++i) {
        const tagId = await this.addTag({ name: data.name[i] });
        await this.tagsForGroupRepository.save(
          this.tagsForGroupRepository.create({
            group: data.groupId,
            tag: tagId.id,
          }),
        );
      }
    } catch (error) {
      Logger.log('error=> add tags for group  function ', error);
      throw error;
    }
  }

  async editTagsForGroup(data: AddTagsDto) {
    try {
      for (let i = 0; i < data.name.length; ++i) {
        const tagId = await this.addTag({ name: data.name[i] });
        await this.tagsForGroupRepository.save(
          this.tagsForGroupRepository.create({
            group: data.groupId,
            tag: tagId.id,
          }),
        );
      }
    } catch (error) {
      Logger.log('error=> add tags for group  function ', error);
      throw error;
    }
  }

  async addTagsForPost(data: AddTagsDto) {
    try {
      for (let i = 0; i < data.name.length; ++i) {
        const tagId = await this.addTag({ name: data.name[i] });
        await this.tagsForPostRepository.save(
          this.tagsForPostRepository.create({
            post: data.postId,
            tag: tagId.id,
          }),
        );
      }
    } catch (error) {
      Logger.log('error=> add tags for posts function ', error);
      throw error;
    }
  }

  async gettags(query: FilterSearchDto, request: any) {
    try {
      const user = await this.authService.verifyToken(request);
      if (!user) {
        throw new NotFoundException('User not authorization!!!');
      }
      const data = await this.tagsNameRepository
        .createQueryBuilder('tags')
        .limit(query.limit)
        .offset(query.offset)
        .orderBy('tags.name', 'DESC')
        .where(`lower("tags"."name") LIKE lower('${query.beginning || ''}%')`)
        .getMany();
      return {
        data: data,
        error: false,
        message: 'this is a tags',
      };
    } catch (error) {
      Logger.log('error=> get tags function ', error);
      throw error;
    }
  }

  async addTag(data: AddTagDto) {
    try {
      const newTag = await this.tagsNameRepository
        .createQueryBuilder()
        .insert()
        .into(TagsNameEntityBase)
        .values(data)
        .orIgnore(`("id") DO NOTHING`)
        .execute();
      if (newTag.identifiers[0]) {
        return { id: newTag.identifiers[0].id };
      }
      const isTag = await this.tagsNameRepository.findOne({
        where: { name: data.name },
      });
      return { id: isTag.id };
    } catch (error) {
      Logger.log('error=> add tag function ', error);
      throw error;
    }
  }

  async addDefaultTag(request: any) {
    const token = (request.headers['authorization'] + '').split(' ')[1];
    if (token === TOKEN_FOR_DEFAULT_TAGS) {
      const ruTags = defaultRuTags;
      const usTags = defaultUsTags;
      const sutiMuti = defaultFunTags;
      for (let i = 0; i < ruTags.length; ++i) {
        await this.addTag({ name: ruTags[i] });
      }
      for (let i = 0; i < usTags.length; ++i) {
        await this.addTag({ name: usTags[i] });
      }
      for (let i = 0; i < sutiMuti.length; ++i) {
        await this.addTag({ name: sutiMuti[i] });
      }
    } else {
      throw new UnauthorizedException(
        'You do not have privileges on this endpoint.',
      );
    }
  }

  // only once
  async deleteTagById(id: number, request: any) {
    const token = (request.headers['authorization'] + '').split(' ')[1];
    if (token === TOKEN_FOR_DEFAULT_TAGS) {
      await this.tagsNameRepository.delete(id);
    } else {
      throw new UnauthorizedException(
        'You do not have privileges on this endpoint.',
      );
    }
    return true;
  }
}
