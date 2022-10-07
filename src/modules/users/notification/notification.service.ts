import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNotificationDto } from './dto/create.post.notification.dto';
import { NotificationEntityBase } from './entity/notification.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationEntityBase)
    private notificationRepository: Repository<NotificationEntityBase>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async createNotification(data: CreateNotificationDto) {
    try {
      const notification = await this.notificationRepository.save(
        this.notificationRepository.create({
          userId: data.userId,
          forUserId: data.forUserId,
          postId: data.postId,
          groupId: data.groupId,
          commentId: data.commentId,
          notificationType: data.notificationType,
        }),
      );
      return notification;
    } catch (error) {
      Logger.log('create post notification function ', error);
      throw error;
    }
  }

  async getMyNotification(req: any) {
    try {
      const userAuth = await this.authService.verifyToken(req);

      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const myNotification = await this.notificationRepository
        .createQueryBuilder('notification')
        .leftJoinAndSelect('notification.userId', 'userEntity')
        .leftJoinAndSelect('notification.postId', 'postEntity')
        .leftJoinAndSelect('notification.commentId', 'commentEntity')
        .leftJoinAndSelect('notification.groupId', 'groupEntity')
        .select('notification')
        .addSelect([
          'postEntity.id',
          'postEntity.title',
          'postEntity.rating',
          'postEntity.createdAt',
        ])
        .addSelect(['commentEntity.id', 'commentEntity.comment'])
        .addSelect(['groupEntity.id', 'groupEntity.title'])
        .addSelect([
          'userEntity.id',
          'userEntity.nicname',
          'userEntity.profilePhotoUrl',
        ])
        .orderBy('notification.createdAt', 'DESC')
        .where('notification.forUserId = :id', { id: userAuth.id })
        .getMany();
      return {
        data: myNotification,
        error: false,
        message: 'Its my notifications.',
      };
    } catch (error) {
      Logger.log('get my post notification function');
      throw error;
    }
  }
}
