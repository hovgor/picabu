import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class AddToFAvoritesDto {
  @IsNumber()
  @IsOptional()
  userId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  postId: number;
}
