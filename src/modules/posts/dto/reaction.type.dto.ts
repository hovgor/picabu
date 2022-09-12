import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
// import { PostReactions } from 'src/shared/types/reactions';

export class ReactionTypeForPostDto {
  // @ApiProperty({ enum: ['default', 'Smile', 'Kind', 'Wow', 'Cry', 'Angry'] })
  // @IsNotEmpty()
  // @IsNumber()
  // reactionType: PostReactions;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  postId: number;
}
