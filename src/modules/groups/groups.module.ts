import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TagsEntityBase } from '../posts/tags/entity/tags.entity';
import { GroupsEntityBase } from './entity/groups.entity';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { TagsService } from '../posts/tags/tags.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([GroupsEntityBase, TagsEntityBase]),
    AuthModule,
  ],
  controllers: [GroupsController],
  providers: [GroupsService, TagsService],
  exports: [GroupsService],
})
export class GroupsModule {}
