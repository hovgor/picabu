import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class TokenForDbDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  @IsString()
  deviceId?: string;
}
