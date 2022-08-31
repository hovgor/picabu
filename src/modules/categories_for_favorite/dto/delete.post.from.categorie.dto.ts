import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeletePostFromCategorieDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  categorieId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  postId: number;
}
