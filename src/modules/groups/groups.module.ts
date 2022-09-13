import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { GroupsEntityBase } from './entity/groups.entity';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { TagsService } from '../tags/tags.service';
import { TagsModule } from '../tags/tags.module';
import { TagsPostEntityBase } from '../tags/entity/tags.for.posts.entity';
import { TagsNameEntityBase } from '../tags/entity/tags.name.entity';
import { TagsGroupEntityBase } from '../tags/entity/tags.for.group.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      GroupsEntityBase,
      TagsPostEntityBase,
      TagsNameEntityBase,
      TagsGroupEntityBase,
    ]),
    forwardRef(() => TagsModule),
    AuthModule,
  ],
  controllers: [GroupsController],
  providers: [GroupsService, TagsService],
  exports: [GroupsService],
})
export class GroupsModule {}
