import { Controller, Get, Patch, Body, Delete } from '@nestjs/common';

import { NotificationsService } from './notifications.service';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { ViewedNotifDto } from './dtos/viewed-notif.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  getNotifs(@AuthUser('sub') sub: number) {
    return this.notificationsService.getNotifs(sub);
  }

  @Patch()
  viewedNotif(@Body() viewedNotifDto: ViewedNotifDto) {
    return this.notificationsService.viewedNotif(viewedNotifDto);
  }

  @Delete()
  deleteNotifs(@AuthUser('sub') sub: number) {
    return this.notificationsService.deleteNotifs(sub);
  }

  @Get('count')
  getNotifsCount(@AuthUser('sub') sub: number) {
    return this.notificationsService.getNotifsCount(sub);
  }

  @Get('message-count')
  getMessageNotifsCount(@AuthUser('sub') sub: number) {
    return this.notificationsService.getMessageNotifsCount(sub);
  }
}
