import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { PostReactions } from 'src/shared/types/reactions';

export class ReactPostDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @IsNumber()
  @IsOptional()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(PostReactions, { message: 'Invalid reaction type !' })
  reactionId: PostReactions;
}
