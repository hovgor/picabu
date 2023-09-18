import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber } from 'class-validator';

export class followUnfollowBodyDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  relatedId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsIn([0, 1, 2])
  status: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}

export class GetFollowRequestsBodyDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
