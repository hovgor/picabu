import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Paginate } from 'src/modules/users/dto/paginate.dto';

export class GetRepliesDto extends Paginate {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  parentCommentId: number;

  @IsNumber()
  @IsOptional()
  userId: number;
}
