import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RequestHeadersDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  refresh_token: string;
}
