import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ schema: 'public', name: 'tags_name' })
export class TagsNameEntityBase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index('names_tags')
  @Column({ default: null, nullable: false, unique: true })
  name: string;
}
