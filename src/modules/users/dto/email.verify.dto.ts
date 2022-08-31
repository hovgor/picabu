import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class EmailVerifyDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  email: string;
}
