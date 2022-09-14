import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddTagDto {
  @ApiProperty()
  @IsString()
  name: string;
}
