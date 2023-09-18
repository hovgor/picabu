import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotificationTokensEntityBase } from './entity/notificationTokens.entity';
import { IsNull, Repository } from 'typeorm';
import { NotificationMainService } from './notifications.config';
import { NotificationsEntityBase } from './entity/notifications.entity';
import { UsersEntityBase } from 'src/modules/users/entity/users.entity';
import { GroupsEntityBase } from 'src/modules/groups/entity/groups.entity';
import { PostsEntityBase } from 'src/modules/posts/entity/posts.entity';
import { Utils } from 'src/shared/utils/utils';
import { PostReactionEntityBase } from 'src/modules/posts/entity/post.reactions.entity';
import { UserFollowRequestEntitiyBase } from 'src/modules/users/entity/follow.request.entity';
import { AdminsForComunityEntityBase } from 'src/modules/groups/entity/admins.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @Inject(NotificationMainService)
    private readonly notificationMainService: NotificationMainService,
    @InjectRepository(NotificationTokensEntityBase)
    private readonly notificationTokensRepository: Repository<NotificationTokensEntityBase>,
    @InjectRepository(NotificationsEntityBase)
    private readonly notificationRepository: Repository<NotificationsEntityBase>,
    @InjectRepository(UsersEntityBase)
    private usersRepository: Repository<UsersEntityBase>,
    @InjectRepository(GroupsEntityBase)
    private communityRepository: Repository<GroupsEntityBase>,
    @InjectRepository(PostsEntityBase)
    private postRepository: Repository<PostsEntityBase>,
    @InjectRepository(PostReactionEntityBase)
    private postReactionRepository: Repository<PostReactionEntityBase>,
    @InjectRepository(UserFollowRequestEntitiyBase)
    private readonly followRequestRepository: Repository<UserFollowRequestEntitiyBase>,
    @InjectRepository(AdminsForComunityEntityBase)
    private adminsForComunityRepository: Repository<AdminsForComunityEntityBase>,
    @Inject(Utils)
    private readonly utils: Utils,
  ) {}

  async upsertDeviceNotificationToken(body: any) {
    try {
      const { userId, deviceId, platform, notificationToken } = body;
      await this.notificationTokensRepository.query(
        `INSERT INTO notification_tokens(user_id, device_id,platform,notification_token)
                     VALUES($1,$2,$3,$4) ON CONFLICT(device_id) DO UPDATE SET user_id = ${
                       userId || null
                     }, notification_token = '${notificationToken}'`,
        [userId || null, deviceId, platform, notificationToken],
      );

      return { data: null, error: false, message: 'Notif Token Inserted !' };
    } catch (error) {
      Logger.log('error=> get me function ', error);
      throw error;
    }
  }

  async sendAndSaveNotification(
    userId: number,
    notificationType: number,
    relatedToIdObj: any,
  ) {
    try {
      if (
        (relatedToIdObj.relatedUser && relatedToIdObj.relatedUser == userId) ||
        !userId
      )
        return;
      // let deniedNotifList = await this.checkNotificationPreferences(userId)
      // if (deniedNotifList.includes(notificationType)) return

      const existingNotification = await this.notificationRepository.findOne({
        where: {
          user: userId,
          relUser: relatedToIdObj.relatedUser,
          relPost: relatedToIdObj.relatedPost,
          relCom: relatedToIdObj.relatedCommunity,
          notificationType,
        },
      });

      if (
        existingNotification &&
        notificationType != 5 &&
        notificationType != 6
      ) {
        existingNotification.updatedAt = new Date();
        await this.notificationRepository.save(existingNotification);
        return;
      }

      await this.notificationRepository
        .createQueryBuilder('notification')
        .insert()
        .values({
          user: userId,
          relUser: relatedToIdObj.relatedUser || null,
          relPost: relatedToIdObj.relatedPost || null,
          relCom: relatedToIdObj.relatedCommunity || null,
          notificationType,
        })
        .onConflict('DO NOTHING')
        .execute();

      let tokens: any = await this.notificationTokensRepository
        .createQueryBuilder('tokens')
        .select(['tokens.notificationToken', 'tokens.platform'])
        .where({ user: userId })
        .getMany();

      const data = await this.notificationGenerator(
        userId,
        notificationType,
        relatedToIdObj,
      );
      const badge = await this.notificationRepository
        .createQueryBuilder('notification')
        .where('notification.user = :userId', { userId })
        .andWhere('notification.showed = :showed', { showed: false })
        .getCount();

      if (tokens.length) {
        tokens = tokens.map((elem) => {
          return {
            token: elem.notificationToken,
            platform: elem.platform,
            badge,
          };
        });
        this.notificationMainService.sendDataNotification(tokens, data);
      }
    } catch (error) {
      Logger.error(error);
    }
  }

  async deleteNotification(
    userId: number,
    notificationType: number,
    relatedToIdObj: any,
  ) {
    const { relatedCommunity, relatedUser, relatedPost } = relatedToIdObj;

    await this.notificationRepository.delete({
      notificationType,
      user: userId || IsNull(),
      relUser: relatedUser || IsNull(),
      relCom: relatedCommunity || IsNull(),
      relPost: relatedPost || IsNull(),
    });
  }

  async notificationGenerator(userId, notificationType, relatedToIdObj) {
    const notification: any = { userId, notificationType, relatedToIdObj };
    const { relatedUser, relatedCommunity, relatedPost } = relatedToIdObj;
    let user, community, post;
    switch (notificationType) {
      case 0: // User started following you
      case 1: // User requested to follow you
        user = await this.usersRepository.findOne({
          where: { id: relatedUser },
        });
        user.profilePhotoUrl ? Utils.generateS3Url(user, 1) : null;
        notification.nickname = user.nickname;
        notification.imageUrl = user.profilePhotoUrl;
        break;
      case 2: // Subscribe Request Sent To Community Admins !
      case 3: // Subscribed To Community !
        user = await this.usersRepository.findOne({
          where: { id: relatedUser },
        });
        community = await this.communityRepository.findOne({
          where: { id: relatedCommunity },
        });
        user.profilePhotoUrl ? Utils.generateS3Url(user, 1) : null;
        notification.nickname = user.nickname;
        notification.imageUrl = user.profilePhotoUrl;
        notification.communityName = community.name;
        break;
      case 4: // User reacted your post
        user = await this.usersRepository.findOne({
          where: { id: relatedUser },
        });
        post = await this.postRepository.findOne({
          where: { id: relatedPost },
        });
        const reaction = await this.postReactionRepository
          .createQueryBuilder('reaction')
          .where('reaction.user = :userId', { userId: relatedUser })
          .andWhere('reaction.post = :postId', { postId: relatedPost })
          .getOne();

        user.profilePhotoUrl ? Utils.generateS3Url(user, 1) : null;
        notification.nickname = user.nickname;
        notification.imageUrl = user.profilePhotoUrl;
        notification.postName = post.title;
        notification.reaction = reaction.reaction;
        break;

      case 5: // User Commented to your post
      case 6: // User Replied to your post
      case 7: // User UpVoted your post
      case 8: // User DownVoted your post
        user = await this.usersRepository.findOne({
          where: { id: relatedUser },
        });
        post = await this.postRepository.findOne({
          where: { id: relatedPost },
        });
        user.profilePhotoUrl ? Utils.generateS3Url(user, 1) : null;
        notification.nickname = user.nickname;
        notification.imageUrl = user.profilePhotoUrl;
        notification.postName = post.title;
        break;
    }
    return notification;
  }

  async getNotificationsList(body, query) {
    const { limit, offset } = query;
    const { userId } = body;
    try {
      const notificationsList: any = await this.notificationRepository
        .createQueryBuilder('notifications')
        .leftJoin('notifications.user', 'user')
        .leftJoin('notifications.relUser', 'relatedUser')
        .leftJoin('notifications.relCom', 'relatedCommunity')
        .leftJoin('notifications.relPost', 'relatedPost')
        .select([
          'notifications.id',
          'notifications.seen',
          'notifications.showed',
          'notifications.notificationType',
          'notifications.updatedAt',
          'user.id',
          'relatedUser.id',
          'relatedCommunity.id',
          'relatedPost.id',
        ])
        .limit(limit)
        .offset(offset)
        .where({ user: userId })
        .getRawMany();

      await this.notificationRepository
        .createQueryBuilder()
        .update(NotificationsEntityBase)
        .set({ showed: true })
        .where('user_id = :userId', { userId })
        .execute();

      let followrequestscount = 0;
      let subscribeRequestsCount = 0;

      followrequestscount = await this.followRequestRepository
        .createQueryBuilder('requestsCount')
        .where({ followTo: userId, target: 'user' })
        .getCount();

      let adminning: any = await this.adminsForComunityRepository.find({
        where: { user: userId },
        relations: ['group'],
      });
      adminning = adminning?.map((elem) => elem.group.id);
      if (adminning.length) {
        subscribeRequestsCount = await this.followRequestRepository
          .createQueryBuilder('subscribesCount')
          .where(`follow_to_id IN (${adminning})`)
          .andWhere({ target: 'community' })
          .getCount();
      }

      const followRequestsCount = followrequestscount + subscribeRequestsCount;

      for (let i = 0; i < notificationsList.length; i++) {
        const notification = notificationsList[i];
        const {
          notifications_id,
          notifications_notification_type,
          notifications_seen,
          notifications_showed,
          notifications_updated_date,
          user_id,
          relatedUser_id,
          relatedCommunity_id,
          relatedPost_id,
        } = notification;

        const updatedNotification = await this.notificationGenerator(
          user_id,
          notifications_notification_type,
          {
            relatedUser: relatedUser_id,
            relatedCommunity: relatedCommunity_id,
            relatedPost: relatedPost_id,
          },
        );

        notificationsList[i] = {
          id: notifications_id,
          seen: notifications_seen,
          showed: notifications_showed,
          updatedAt: Utils.generateDateInMs(notifications_updated_date),
          ...updatedNotification,
        };
      }
      return {
        data: {
          followRequestsCount,
          notificationsList,
        },
        error: false,
        message: 'Notif List Recieved !',
      };
    } catch (error) {
      throw error;
    }
  }

  async markNotificationAsSeen(body) {
    const { userId, notificationId } = body;
    try {
      await this.notificationRepository
        .createQueryBuilder()
        .update(NotificationsEntityBase)
        .set({ seen: true })
        .where('user_id = :userId', { userId })
        .andWhere('id = :notificationId', { notificationId })
        .execute();

      return { data: null, error: false, message: 'Notification is Seen !' };
    } catch (error) {
      throw error;
    }
  }

  async deleteSingleNotification(body) {
    const { userId, notificationId } = body;
    try {
      await this.notificationRepository.delete({
        id: notificationId,
        user: userId,
      });
      return { data: null, error: false, message: 'Notification Deleted!' };
    } catch (error) {
      throw error;
    }
  }

  async deleteAllNotificaitons(body) {
    const { userId } = body;
    try {
      await this.notificationRepository.delete({
        user: userId,
      });
      return {
        data: null,
        error: false,
        message: 'All Notifications Deleted!',
      };
    } catch (error) {
      throw error;
    }
  }
}
