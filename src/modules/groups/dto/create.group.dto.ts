import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  attachment: string;

  @ApiProperty()
  @IsString()
  url: string;

  @ApiProperty({ default: null })
  tags?: any[] = null;
}
