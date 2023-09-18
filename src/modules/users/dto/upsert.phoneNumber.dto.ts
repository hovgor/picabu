import { ApiProperty } from '@nestjs/swagger';
import { IsString,  Length } from 'class-validator';

export class EditProfileDto {
  @ApiProperty()
  @IsString()
  @Length(11)
  phoneNumber: number;
}
