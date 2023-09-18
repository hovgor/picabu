import { Module } from '@nestjs/common';
import { GlobalsService } from './globals.service';
import { GlobalsController } from './globals.controller';
import AWS_S3 from 'src/config/s3.cofig';

@Module({
  providers: [GlobalsService, AWS_S3],
  controllers: [GlobalsController],
})
export class GlobalsModule {}
