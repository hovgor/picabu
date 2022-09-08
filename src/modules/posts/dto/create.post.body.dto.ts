import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional()
  @IsString()
  description?: string;

  @ApiProperty({ default: null })
  tags?: any[] = null;

  @ApiPropertyOptional({ default: null })
  attachment?: any[] = null;
}
