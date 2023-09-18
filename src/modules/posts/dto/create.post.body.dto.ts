import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePostBodyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ default: false })
  @IsBoolean()
  @IsNotEmpty()
  donation?: boolean = false;

  @ApiPropertyOptional({ type: [String], description: 'Array of strings' })
  @IsArray()
  @IsString({ each: true })
  description: string[];

  @ApiProperty({ default: [] })
  tags: string[] = [];

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  community_id?: number;
}
