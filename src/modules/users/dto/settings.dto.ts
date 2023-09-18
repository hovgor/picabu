import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class ChangePhotoDto {
  @IsNumber()
  @IsOptional()
  userId: number;

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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: string;

  @IsNumber()
  @IsOptional()
  userId: number;
}

export class ChangeEmailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsOptional()
  id: number;

  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // userType: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  pin: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newPassword: string;

  @IsNumber()
  @IsOptional()
  id: number;
}

export class VerifyEmailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;
}

export class VerifyPhoneDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  newPhoneNumber: string;

  @IsNumber()
  @IsOptional()
  userId: number;
}

export class DeleteAccountDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: string;

  @IsNumber()
  @IsOptional()
  userId: number;
}
