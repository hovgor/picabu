import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateCategorieForFavoritesDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(16)
  @MinLength(3)
  title: string;
}
