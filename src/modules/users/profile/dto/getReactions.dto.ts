import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Paginate } from 'src/modules/users/dto/paginate.dto';

export class GetReactionsQuery extends Paginate {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  reactionId: number;
}
