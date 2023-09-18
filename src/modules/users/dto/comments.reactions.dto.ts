import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { PostReactions } from 'src/shared/types/reactions';

export class CommentsReactionsDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  commentId: number;

  @IsNumber()
  @IsOptional()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PostReactions, { message: 'Invalid reaction type !' })
  reactionId: PostReactions;
}
