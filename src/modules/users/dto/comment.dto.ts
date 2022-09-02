import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CommentDto {
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
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  comment: string;


  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  parrentCommentId: number;
}
