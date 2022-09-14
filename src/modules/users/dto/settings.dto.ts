import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class ChangePhotoDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  profilePhoto: string;
}

export class ChangeNicknameDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nickname: string;
}

export class ChangeEmailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  userType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  pin: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  newPassword: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsOptional()
  id: number;
}
