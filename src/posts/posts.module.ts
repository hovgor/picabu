import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { PostsEntityBase } from './entity/posts.entity';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { UploadFileEntityBase } from './upload_file/entity/upload_file.entity';
import { UploadFileService } from './upload_file/upload_file.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostsEntityBase, UploadFileEntityBase]),
    UsersModule,
    AuthModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, UploadFileService],
  exports: [PostsService],
})
export class PostsModule {}
