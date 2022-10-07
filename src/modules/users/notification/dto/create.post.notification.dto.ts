import { IsNumber, IsString } from 'class-validator';
import { NotificationType } from 'src/shared/types/notification.type';

export class CreateNotificationDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  postId?: number = null;

  @IsString()
  notificationType: NotificationType;

  @IsNumber()
  forUserId: number;

  @IsNumber()
  commentId?: number = null;

  @IsNumber()
  groupId?: number = null;
}
