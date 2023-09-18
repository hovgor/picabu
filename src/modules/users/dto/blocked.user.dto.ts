import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class BlockedUserDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  blockUserId: number;

  @IsNumber()
  @IsOptional()
  userId: number;
}
