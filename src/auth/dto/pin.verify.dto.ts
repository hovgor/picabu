import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyPinCodeDto {
  @ApiProperty()
  @IsString()
  pinCode?: string;

  @ApiProperty()
  @IsString()
  email: string;
}
