import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString, IsIn, IsOptional } from 'class-validator';

export class RateDto {
  @IsNumber()
  @IsOptional()
  userId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  targetId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsIn([1, -1])
  rate: number;

}
