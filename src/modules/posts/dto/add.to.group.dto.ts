import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddToGroupDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  groupId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  postId: number;
}
