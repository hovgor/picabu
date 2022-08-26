import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UploadFileDataDto } from './dto/upload.file.data.dto';
import { UploadFileEntityBase } from './entity/upload_file.entity';

@Injectable()
export class UploadFileService {
  constructor(
    @InjectRepository(UploadFileEntityBase)
    private uploadFileRepository: Repository<UploadFileEntityBase>,
  ) {}

  async uploadFilePath(data: UploadFileDataDto) {
    try {
      let id: UploadFileEntityBase;
      if (data.path.length > 0) {
        for (let i = 0; i < data.path.length; ++i) {
          id = await this.uploadFileRepository.save(
            this.uploadFileRepository.create({
              postId: data.postId,
              path: data.path[i],
            }),
          );
        }
      } else {
        id = await this.uploadFileRepository.save(
          this.uploadFileRepository.create({
            postId: data.postId,
            path: data.path[0],
          }),
        );
      }
      return id;
    } catch (error) {
      Logger.log('error=> upload file path function ', error);
      throw error;
    }
  }

  async deleteUploadFilePath(id: number) {
    try {
      const uploadFilePath = await this.uploadFileRepository.findOne({
        where: { id },
      });
      if (!uploadFilePath) {
        throw new NotFoundException('Upload file path dose not exist!!!');
      }
    } catch (error) {
      Logger.log('error=> delete upload file pat function ', error);
      throw error;
    }
  }

  async deleteAllUploadFilePathPost(id: number) {
    try {
      const uploadFilePath = await this.uploadFileRepository.find({
        where: { postId: id },
      });
      if (!uploadFilePath) {
        throw new NotFoundException('Upload file path dose not exist!!!');
      }
      await this.uploadFileRepository.remove(uploadFilePath);
    } catch (error) {
      Logger.log('error=> delete all upload file path posts function ', error);
      throw error;
    }
  }

  async getFilePathById(id: number) {
    try {
      return await this.uploadFileRepository.findOne({ where: { postId: id } });
    } catch (error) {
      Logger.log('error=> get file path by id function ', error);
      throw error;
    }
  }
}
