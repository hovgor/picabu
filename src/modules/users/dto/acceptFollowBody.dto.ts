import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsNotEmpty, IsNumber, ValidateIf } from 'class-validator';

export class AcceptFollowRequestDto {
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsNumber()
  @ValidateIf((dto) => !dto.communityId)
  @IsDefined()
  followeeId?: number;

  @ApiProperty()
  @IsNumber()
  @ValidateIf((dto) => !dto.followeeId)
  @IsDefined()
  communityId?: number;
}
