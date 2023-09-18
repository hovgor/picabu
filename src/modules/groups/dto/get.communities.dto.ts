import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';
import { Paginate } from 'src/modules/users/dto/paginate.dto';

export class CommunitiesTargetsDto extends Paginate {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsIn(['my', 'all', 'joined'])
  target: string;

  @ApiPropertyOptional({ default: '' })
  @IsOptional()
  searchBy?: string = '';
}
