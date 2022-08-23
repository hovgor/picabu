import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AuthEntityBase } from 'src/auth/entity/auth.entity';
import { UsersEntityBase } from 'src/users/entity/users.entity';
import { ConfigEnum } from './config.enum';
import { ConfigService } from './config.service';
import * as dotenv from 'dotenv';
import { PostsEntityBase } from 'src/posts/entity/posts.entity';
import { UploadFileEntityBase } from 'src/posts/upload_file/entity/upload_file.entity';
dotenv.config();

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      name: 'default',
      type: 'postgres',
      schema: 'default',
      host:
        this.configService.get(ConfigEnum.DATABASE_HOST) ||
        process.env.DATABASE_HOST,
      port:
        this.configService.get(ConfigEnum.DATABASE_PORT) ||
        +process.env.DATABASE_PORT,
      username:
        this.configService.get(ConfigEnum.DATABASE_USERNAME) ||
        process.env.DATABASE_USERNAME,
      password:
        this.configService.get(ConfigEnum.DATABASE_PASSWORD) ||
        process.env.DATABASE_PASSWORD,
      database:
        this.configService.get(ConfigEnum.DATABASE_NAME) ||
        process.env.DATABASE_NAME,
      logging: false,
      entities: [
        UsersEntityBase,
        AuthEntityBase,
        PostsEntityBase,
        UploadFileEntityBase,
      ],
      // entities: [process.cwd(), 'entity/**/*.pg.entity.{js, ts}'],
      synchronize: true,
      migrationsRun: false,
      // ssl: {
      //   rejectUnauthorized: false,
      // },
    };
  }
}
