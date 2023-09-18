import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, IsIn } from 'class-validator';
import { Paginate } from './paginate.dto';

export class FeedQuery extends Paginate {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsIn(["new", "top", "my"])
    status: string;
}
