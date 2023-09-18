import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class EditCommunityDto {
  @ApiProperty()
  @IsNumber()
  communityId: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
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
  @IsNumber()
  @IsOptional()
  privacy: boolean;

  @ApiProperty({ default: null })
  @IsOptional()
  tags?: any[] = null;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  admins: number;
}
