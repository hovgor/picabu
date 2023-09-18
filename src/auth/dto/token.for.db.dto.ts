import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class TokenForDbDto {
  @IsNotEmpty()
  @IsInt()
  user: number;

  @IsNotEmpty()
  @IsString()
  accessToken: string;

  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  @IsString()
  deviceId?: string;
}
