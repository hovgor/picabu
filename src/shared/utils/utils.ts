import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { generateFromEmail, generateUsername } from 'unique-username-generator';
import { BlockedEntityBase } from 'src/modules/users/entity/blocked.entity';
import { DontRecommendEntityBase } from 'src/modules/users/entity/dont.recommend.entity';
import { AdminsForComunityEntityBase } from 'src/modules/groups/entity/admins.entity';

export class Utils {
  constructor(
    @InjectRepository(AdminsForComunityEntityBase)
    private adminsForComunityRepository: Repository<AdminsForComunityEntityBase>,
    @InjectRepository(BlockedEntityBase)
    private blockedEntityBase: Repository<BlockedEntityBase>,
    @InjectRepository(DontRecommendEntityBase)
    private dontRecommendEntityBase: Repository<DontRecommendEntityBase>,
  ) {}
  static generateNickname = (email = null) => {
    return email ? generateFromEmail(email, 3) : generateUsername('', 3);
  };

  static generateResponseObj = (responseObj) => {
    for (const key in responseObj) {
      if (key.includes('_')) {
        const newKey = key.replace(/_([a-z])/g, (match, letter) =>
          letter.toUpperCase(),
        );
        responseObj[newKey] = responseObj[key];
        delete responseObj[key];
      }
    }
  };

  static generateDateInMs = (dateFromDb) => new Date(dateFromDb).getTime();

  static generateS3Url = (media: any, type: number) => {
    switch (type) {
      case 1:
        media.profilePhotoUrl =
          process.env.AWS_BUCKET_URL + 'tutu/' + media.profilePhotoUrl;
        break;
      case 2:
        media.profileImgUrl =
          process.env.AWS_BUCKET_URL + 'tutu/' + media.profileImgUrl;
        break;
      case 3:
        media.backgroundImgUrl =
          process.env.AWS_BUCKET_URL + 'tutu/' + media.backgroundImgUrl;
        break;
      default:
        break;
    }
  };

  validBlockUser = async (id: number) => {
    try {
      const users = await this.blockedEntityBase
        .query(`select blocked_user_id as user from "blocked" where user_id =${id} union 
      select user_id as user from "blocked" where blocked_user_id =${id} `);
      const blockedUsers = users.map((item) => item.user);
      return blockedUsers;
    } catch (error) {
      throw error;
    }
  };

  getCommunityAdmins = async (communityId: number) => {
    try {
      const users = await this.adminsForComunityRepository.query(
        `select user_id as user from admins_for_comunity where group_id =${communityId} `,
      );
      const admins = users.map((item) => item.user);
      return admins;
    } catch (error) {
      throw error;
    }
  };

  async dontRecommendList(id: number) {
    try {
      const notRecommendedAuthors = await this.dontRecommendEntityBase
        .createQueryBuilder('dontRecommend')
        .select('dontRecommend.undesired')
        .where({ user: id })
        .getRawMany();

      const undesiredAuthorIds = notRecommendedAuthors.map(
        (item) => item.undesired_author_id,
      );
      return undesiredAuthorIds;
    } catch (error) {
      throw error;
    }
  }
}
