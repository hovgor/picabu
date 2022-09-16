import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class getprofileDataDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  id: number;
}

export class getLikedDislikedPostsCountParam {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  reaction: number;
}

export class getLikedDislikedPostsParam {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  reaction: number;
}
