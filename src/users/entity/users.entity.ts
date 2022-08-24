import { AuthEntityBase } from 'src/auth/entity/auth.entity';
import { PostsEntityBase } from 'src/posts/entity/posts.entity';
import { UserRoles } from 'src/shared/types/roles';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'default', name: 'Users' })
export class UsersEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null, nullable: true })
  email: string;

  @Column({ default: null, nullable: true })
  phone: string;

  @Column({ default: null, nullable: true })
  password: string;

  @Column({ default: null, nullable: true })
  nicname: string;

  @Column({ default: 'local', nullable: false })
  provider: string;

  @Column({ default: null, nullable: true })
  providerId: number;

  @Column({ name: 'device_id', default: null, nullable: true })
  deviceId: string;

  @Column({ default: null, nullable: true })
  role: UserRoles;

  @OneToMany(() => AuthEntityBase, (auth) => auth.userId, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  authEntity: AuthEntityBase[];

  @OneToMany(() => PostsEntityBase, (post) => post.userId, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  postEntity: AuthEntityBase[];

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
