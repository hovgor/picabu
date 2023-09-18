import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn, IsNumber } from 'class-validator';
import { Paginate } from 'src/modules/users/dto/paginate.dto';

export class GetGroupPostsDto extends Paginate {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['new', 'top'])
  status: string;

  @ApiProperty()
  @IsNumber()
  groupId: number;
}
