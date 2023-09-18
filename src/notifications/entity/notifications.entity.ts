import { GroupsEntityBase } from 'src/modules/groups/entity/groups.entity';
import { PostsEntityBase } from 'src/modules/posts/entity/posts.entity';
import { UsersEntityBase } from 'src/modules/users/entity/users.entity';
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Unique,
    UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'public', name: 'notifications' })
@Index(
    ['user', 'relUser', 'relPost', 'relCom', 'notificationType'],
    { unique: true }
)
export class NotificationsEntityBase extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UsersEntityBase)
    @JoinColumn({ name: 'user_id' })
    user: number;

    @ManyToOne(() => UsersEntityBase)
    @JoinColumn({ name: 'related_user' })
    relUser: number;

    @ManyToOne(() => PostsEntityBase)
    @JoinColumn({ name: 'related_post' })
    relPost: number;

    @ManyToOne(() => GroupsEntityBase)
    @JoinColumn({ name: 'related_community' })
    relCom: number;

    @Column({ name: 'notification_type' })
    notificationType: number;

    @Column({ name: 'seen', default: false })
    seen: boolean;

    @Column({ name: 'showed', default: false })
    showed: boolean;

    @CreateDateColumn({
        name: 'created_date',
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    public createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_date',
        type: 'timestamp',
        default: null,
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    public updatedAt: Date;
}
