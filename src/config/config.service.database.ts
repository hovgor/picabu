import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigEnum } from './config.enum';
import { ConfigService } from './config.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class DatabaseConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      name: 'default',
      type: 'postgres',
      schema: 'public',
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
      entities: [process.cwd(), '**/*.entity.{js, ts}'],
      synchronize: true,
      migrationsRun: false,
    };
  }
}
