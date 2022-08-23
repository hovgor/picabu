import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiPropertyOptional()
  @IsString()
  email?: string;

  // @ApiProperty()
  // @IsString()
  // pinCode?: string;

  // @ApiPropertyOptional()
  // @IsString()
  // phone?: string;

  // @ApiProperty()
  // @IsString()
  // newPassword: string;

  // @ApiProperty()
  // @IsString()
  // confirmPassword: string;
}
