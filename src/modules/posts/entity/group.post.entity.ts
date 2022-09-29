// import { CategorieForFavoritsEntityBase } from 'src/modules/categories_for_favorite/entity/categorie.for.favorits.entity';
import { GroupsEntityBase } from 'src/modules/groups/entity/groups.entity';
import {
  BaseEntity,
  //   Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostsEntityBase } from './posts.entity';

@Entity({ schema: 'default', name: 'Posts_to_groups' })
export class PostsToGroupEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => PostsEntityBase, (post) => post.favoritesEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  //   @Column({ nullable: true, name: 'post_id' })
  postId: number;

  @ManyToOne(
    () => GroupsEntityBase,
    (categories) => categories.postToGroupEntity,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  //   @Column({ nullable: true, name: 'group_id' })
  groupId: number;

  @CreateDateColumn({
    name: 'created_date',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;
}
