import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ForgotPasswordDto {
  @ApiPropertyOptional()
  @IsString()
  email?: string;
}
