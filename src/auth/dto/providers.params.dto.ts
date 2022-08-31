import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class PasswordlessNameDto {
  @ApiProperty()
  @IsString()
  providerName: string;
}
