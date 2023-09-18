import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AwsQueryDto } from './dto/aws.dto';
import AWS_S3 from 'src/config/s3.cofig';

@Controller('globals')
@ApiTags('Globals')
export class GlobalsController {
  constructor(private readonly getS3Url: AWS_S3) {}

  @Get('getS3SignedUrl')
  async getS3SignedUrl(@Res() res: Response, @Query() query: AwsQueryDto) {
    try {
      const data = this.getS3Url.getSignedUrl(query);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }
}
