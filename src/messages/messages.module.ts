import { Module } from '@nestjs/common';

import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, NotificationsService],
})
export class MessagesModule {}
