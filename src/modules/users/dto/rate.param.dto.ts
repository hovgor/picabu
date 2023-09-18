import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { TargetType } from 'src/shared/types/rate_target';

export class RateParamsDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(TargetType, { message: 'Invalid Target !' })
  target: TargetType;
}
