import { PostsEntityBase } from 'src/modules/posts/entity/posts.entity';
import { NotificationType } from 'src/shared/types/notification.type';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UsersEntityBase } from '../../entity/users.entity';

@Entity({ schema: 'default', name: 'Post_notification' })
export class PostNotificationEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'for_user_id', nullable: true })
  forUserId: number;

  @Column({ name: 'I_saw_the_notification', default: false })
  sawTheNotification: boolean;

  @ManyToOne(
    () => UsersEntityBase,
    (postNotifEntity) => postNotifEntity.notificationEntity,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  userId: number;

  @Column({ name: 'notification_type' })
  notificationType: NotificationType;

  @ManyToOne(
    () => PostsEntityBase,
    (postNotifEntity) => postNotifEntity.notificationEntity,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  postId: number;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;
}
