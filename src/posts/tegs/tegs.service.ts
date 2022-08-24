import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddTagsDto } from './dto/add.tags.dto';
import { TagsEntityBase } from './entity/tags.entity';

@Injectable()
export class TegsService {
  constructor(
    @InjectRepository(TagsEntityBase)
    private tagsRepository: Repository<TagsEntityBase>,
  ) {}

  async addTags(data: AddTagsDto) {
    try {
      let id: TagsEntityBase;
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
      return id;
    } catch (error) {
      Logger.log('error=> add tags function ', error);
      throw error;
    }
  }
}
