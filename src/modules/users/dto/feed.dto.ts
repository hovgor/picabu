import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString, IsBoolean } from 'class-validator';

export class FeedDto {
  @ApiProperty()
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsBoolean()
  actual: boolean;
}
