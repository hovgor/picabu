import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class Paginate {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    limit: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    offset: number;
}
