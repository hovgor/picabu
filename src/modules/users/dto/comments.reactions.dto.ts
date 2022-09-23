import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CommentsReactionsDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  commentId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  reactionType: number;
}
