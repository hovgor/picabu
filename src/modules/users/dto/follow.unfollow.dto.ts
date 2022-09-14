import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class followUnfollowDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  followToId: number;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  userFollowsAccount: boolean;
}