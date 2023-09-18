import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';

export class ReportBodyDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsIn([0, 1])
  target: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  relatedId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsIn([0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  type: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
