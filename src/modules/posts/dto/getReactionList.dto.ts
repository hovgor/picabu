import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Paginate } from 'src/modules/users/dto/paginate.dto';

export class GetReactionsList extends Paginate {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  reactionId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  postId: number;

  @IsNumber()
  @IsOptional()
  userId: number;
}
