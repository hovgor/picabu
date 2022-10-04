import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { NotificationService } from './notification.service';

@ApiTags('Notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get('getMyNotification')
  @ApiBearerAuth()
  async getMyNotification(@Res() res: Response, @Req() req: any) {
    try {
      const myNotification =
        await this.notificationService.getMyPostNotification(req);
      return res.status(HttpStatus.ACCEPTED).json(myNotification);
    } catch (error) {
      throw error;
    }
  }
}
