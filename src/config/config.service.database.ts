import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AuthEntityBase } from 'src/auth/entity/auth.entity';
import { UsersEntityBase } from 'src/modules/users/entity/users.entity';
import { ConfigEnum } from './config.enum';
import { ConfigService } from './config.service';
import * as dotenv from 'dotenv';
import { ReactionsEntityBase } from '../modules/users/entity/reactions.entity';
dotenv.config();
import { PostsEntityBase } from 'src/modules/posts/entity/posts.entity';
import { UploadFileEntityBase } from 'src/modules/posts/upload_file/entity/upload_file.entity';
import { TagsEntityBase } from 'src/modules/posts/tags/entity/tags.entity';
import { CategorieForFavoritsEntityBase } from 'src/modules/categories_for_favorite/entity/categorie.for.favorits.entity';
import { FavoritsEntityBase } from 'src/modules/posts/entity/favorite.post.entity';
import { GroupsEntityBase } from 'src/modules/groups/entity/groups.entity';
import { CommentsEntityBase } from 'src/modules/users/entity/comments.entity';
import { SubscribeGroupEntityBase } from 'src/modules/users/entity/subscribe.group.entity';
import { UserFollowEntitiyBase } from 'src/modules/users/entity/user.following.entity';
import { ReactionIconsEntityBase } from 'src/modules/posts/reaction-icons/entity/reaction.icons.entity';

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
        ReactionsEntityBase,
        TagsEntityBase,
        CategorieForFavoritsEntityBase,
        FavoritsEntityBase,
        GroupsEntityBase,
        CommentsEntityBase,
        SubscribeGroupEntityBase,
        UserFollowEntitiyBase,
        ReactionIconsEntityBase,
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
