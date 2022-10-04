import { IsNumber, IsString } from 'class-validator';
import { NotificationType } from 'src/shared/types/notification.type';

export class CreatePostNotificationDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  postId: number;

  @IsString()
  notificationType: NotificationType;

  @IsNumber()
  forUserId: number;
}
