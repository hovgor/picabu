import { CategorieForFavoritsEntityBase } from 'src/modules/categories_for_favorite/entity/categorie.for.favorits.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PostsEntityBase } from './posts.entity';

@Entity({ schema: 'default', name: 'Favorite_posts' })
export class FavoritsEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PostsEntityBase, (post) => post.favoritesEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  @Column({ nullable: true, name: 'post_id' })
  postId: number;

  @ManyToOne(
    () => CategorieForFavoritsEntityBase,
    (categories) => categories.categoriesEntity,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  @Column({ nullable: true, name: 'categories_id' })
  categoriesId: number;

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
