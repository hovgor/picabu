import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TagsGroupEntityBase } from './entity/tags.for.group.entity';
import { TagsPostEntityBase } from './entity/tags.for.posts.entity';
import { TagsNameEntityBase } from './entity/tags.name.entity';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TagsNameEntityBase,
      TagsPostEntityBase,
      TagsGroupEntityBase,
    ]),
    AuthModule,
  ],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
