import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class FeedDto {
  @ApiProperty()
  @IsNumber()
  userId: number;
}

export class FeedParamsDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  status: string;
}
