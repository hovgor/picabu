import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class GetCommunityDto {
  @IsNumber()
  userId: number;

  @ApiProperty()
  @IsNumber()
  communityId: number;
}
