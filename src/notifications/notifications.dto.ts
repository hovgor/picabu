import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpsertNotifTokensDto {
    @IsNumber()
    @IsOptional()
    userId: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    deviceId: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsIn(['android', 'ios'])
    platform: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    notificationToken: string;
}


export class MarkAsSeenDto {
    @IsNumber()
    @IsOptional()
    userId: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    notificationId: number;
}

export class DeleteSingleNotificationDto {
    @IsNumber()
    @IsNotEmpty()
    userId: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    notificationId: number;
}

