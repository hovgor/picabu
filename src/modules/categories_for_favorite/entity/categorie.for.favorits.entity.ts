import { PostsEntityBase } from 'src/modules/posts/entity/posts.entity';
import { UsersEntityBase } from 'src/modules/users/entity/users.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'default', name: 'Categorie_For_Favorits' })
export class CategorieForFavoritsEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'default', nullable: true })
  title: string;

  @ManyToMany((type) => PostsEntityBase, {
    onDelete: 'CASCADE',
    nullable: true,
    eager: true,
  })
  @JoinTable()
  public post: PostsEntityBase[];

  @ManyToOne(
    () => UsersEntityBase,
    (user) => user.categorieForFavoritesEntity,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  @Index()
  @Column()
  user: number;

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
