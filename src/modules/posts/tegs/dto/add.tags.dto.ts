import { IsNumber, IsString } from 'class-validator';

export class AddTagsDto {
  @IsString()
  name: string[];

  @IsNumber()
  postId: number;
}
