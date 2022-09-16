import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class HelpCenterDto {
  @ApiProperty()
  @IsString()
  message: string;
}
