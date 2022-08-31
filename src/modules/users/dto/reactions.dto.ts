import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class ReactionsDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  userId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  postId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  reactionType: number;
}
