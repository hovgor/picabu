import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty()
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  userId?: number;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  backgroundImgUrl: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  profileImgUrl: string;

  @ApiProperty()
  @IsBoolean()
  privacy: boolean;

  @ApiProperty({ default: [null, null] })
  tags: string[];

  @ApiProperty({ default: [null, null] })
  admins: number[];
}
