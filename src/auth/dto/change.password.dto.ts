import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class Change1PasswordDto {
  @ApiProperty()
  @IsString()
  email: string;

  @ApiProperty()
  @IsString()
  newPassword: string;

  @ApiProperty()
  @IsString()
  ticket: string;
}
