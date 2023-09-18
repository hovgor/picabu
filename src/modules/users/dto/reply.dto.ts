import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class ReplyCommentDto {
  @IsNumber()
  @IsOptional()
  userId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  commentId: number;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  replyId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comment: string;
}
