import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostNotificationDto } from './dto/create.post.notification.dto';
import { PostNotificationEntityBase } from './entity/post.notification.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(PostNotificationEntityBase)
    private postNotificationRepository: Repository<PostNotificationEntityBase>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async createPostNotification(data: CreatePostNotificationDto) {
    try {
      const postNotification = await this.postNotificationRepository.save(
        this.postNotificationRepository.create({
          userId: data.userId,
          forUserId: data.forUserId,
          postId: data.postId,
          notificationType: data.notificationType,
        }),
      );
      return postNotification;
    } catch (error) {
      Logger.log('create post notification function ', error);
      throw error;
    }
  }

  async getMyPostNotification(req: any) {
    try {
      const userAuth = await this.authService.verifyToken(req);

      if (!userAuth) {
        throw new UnauthorizedException('User not authorized!!!');
      }
      const myNotification = await this.postNotificationRepository
        .createQueryBuilder('notification')
        .leftJoinAndSelect('notification.userId', 'userEntity')
        .select('notification')
        .addSelect([
          'userEntity.id',
          'userEntity.nicname',
          'userEntity.email',
          'userEntity.deviceId',
          'userEntity.providerId',
          'userEntity.profilePhotoUrl',
        ])
        .andWhere('notification.forUserId = :id', { id: userAuth.id })
        .where({ sawTheNotification: false })
        .getMany();
      return myNotification;
    } catch (error) {
      Logger.log('get my post notification function');
      throw error;
    }
  }
}
