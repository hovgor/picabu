import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfigService } from '../config/config.service.database';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useExisting: DatabaseConfigService,
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
