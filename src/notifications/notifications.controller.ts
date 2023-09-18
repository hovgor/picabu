import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  DeleteSingleNotificationDto,
  MarkAsSeenDto,
  UpsertNotifTokensDto,
} from './notifications.dto';
import { NotificationsService } from './notifications.service';
import { Response } from 'express';
import {
  AuthMiddleware,
  MultiAuthMiddleware,
} from 'src/shared/middlewares/auth.middleware';
import { Paginate } from 'src/modules/users/dto/paginate.dto';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiResponse({
    status: HttpStatus.ACCEPTED,
    description: 'Insert Or Update Notifications Token To Get Notifications !',
  })
  @ApiBearerAuth()
  @Post('/upsertDeviceNotificationToken')
  @UseInterceptors(MultiAuthMiddleware)
  async upsertDeviceNotificationToken(
    @Body() body: UpsertNotifTokensDto,
    @Res() res: Response,
  ) {
    try {
      const data =
        await this.notificationsService.upsertDeviceNotificationToken(body);
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get Notifications List !',
  })
  @ApiBearerAuth()
  @Get('/notificationsList')
  @UseInterceptors(AuthMiddleware)
  async getNotificationsList(
    @Body() body: any,
    @Res() res: Response,
    @Query() query: Paginate,
  ) {
    try {
      const data = await this.notificationsService.getNotificationsList(
        body,
        query,
      );
      return res.status(HttpStatus.ACCEPTED).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Mark Notification As Seen!',
  })
  @ApiBearerAuth()
  @Patch('/markAsSeen')
  @UseInterceptors(AuthMiddleware)
  async markNotificationAsSeen(
    @Body() body: MarkAsSeenDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.notificationsService.markNotificationAsSeen(body);
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Delete Single Notification!',
  })
  @ApiBearerAuth()
  @Delete('/singleNotification')
  @UseInterceptors(AuthMiddleware)
  async deleteSingleNotification(
    @Body() body: DeleteSingleNotificationDto,
    @Res() res: Response,
  ) {
    try {
      const data = await this.notificationsService.deleteSingleNotification(
        body,
      );
      return res.status(HttpStatus.OK).json(data);
    } catch (error) {
      throw error;
    }
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete All Notification!',
  })
  @ApiBearerAuth()
  @Delete('/allNotifications')
  @UseInterceptors(AuthMiddleware)
  async deleteAllNotificaitons(@Req() req: any, @Res() res: Response) {
    try {
      const data = await this.notificationsService.deleteAllNotificaitons(
        req.body,
      );
      return res.status(HttpStatus.NO_CONTENT).json(data);
    } catch (error) {
      throw error;
    }
  }
}
