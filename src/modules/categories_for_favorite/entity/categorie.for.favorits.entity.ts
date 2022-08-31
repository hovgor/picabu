import { FavoritsEntityBase } from 'src/modules/posts/entity/favorite.post.entity';
import { UsersEntityBase } from 'src/modules/users/entity/users.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ schema: 'default', name: 'Categorie_For_Favorits' })
export class CategorieForFavoritsEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'default', nullable: true })
  title: string;

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

  @OneToMany(() => FavoritsEntityBase, (post) => post.categoriesId, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinTable()
  categoriesEntity: FavoritsEntityBase[];

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
