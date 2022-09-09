import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class FeedDto {
  @ApiProperty()
  @IsNumber()
  id: number;
}
