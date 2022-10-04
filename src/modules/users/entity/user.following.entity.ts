import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
  JoinTable,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { UsersEntityBase } from './users.entity';

@Entity({ schema: 'default', name: 'user_following' })
export class UserFollowEntitiyBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntityBase, (user) => user.followId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  userId: number;

  @OneToMany(() => UsersEntityBase, (user) => user.followId, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  userEntity: UsersEntityBase[];

  @ManyToOne(() => UsersEntityBase, (user) => user.followId, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  followToId: number;

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
