import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FilterSearchDto } from '../dto/filter.search.dto';
import { AddTagsDto } from './dto/add.tags.dto';
import { TagsEntityBase } from './entity/tags.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagsEntityBase)
    private tagsRepository: Repository<TagsEntityBase>,
  ) {}

  async addTags(data: AddTagsDto) {
    try {
      let id: TagsEntityBase;

      if (data.postId) {
        if (data.name.length > 0) {
          for (let i = 0; i < data.name.length; ++i) {
            id = await this.tagsRepository.save(
              this.tagsRepository.create({
                postId: data.postId,
                name: data.name[i],
              }),
            );
          }
        } else {
          id = await this.tagsRepository.save(
            this.tagsRepository.create({
              postId: data.postId,
              name: data.name[0],
            }),
          );
        }
      }
      if (data.groupId) {
        if (data.name.length > 0) {
          for (let i = 0; i < data.name.length; ++i) {
            id = await this.tagsRepository.save(
              this.tagsRepository.create({
                groupId: data.groupId,
                name: data.name[i],
              }),
            );
          }
        } else {
          id = await this.tagsRepository.save(
            this.tagsRepository.create({
              groupId: data.groupId,
              name: data.name[0],
            }),
          );
        }
      }

      return id;
    } catch (error) {
      Logger.log('error=> add tags function ', error);
      throw error;
    }
  }

  async gettags(query: FilterSearchDto) {
    try {
      const [result, count] = await this.tagsRepository
        .createQueryBuilder('tags')
        .limit(query.limit)
        .offset(query.offset)
        .orderBy('tags.createdAt', 'DESC')
        .where(`lower("tags"."name") LIKE lower('${query.beginning || ''}%')`)
        .getManyAndCount();
      return {
        data: { result, count },
        error: false,
        message: 'this is a posts',
      };
    } catch (error) {
      Logger.log('error=> get tags function ', error);
      throw error;
    }
  }
}
