import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddToFAvoritesDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  categoriesId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  postId: number;
}
