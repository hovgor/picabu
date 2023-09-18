import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsString } from 'class-validator';

export class DontReccomendDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    dontRecommendId: number;
}
