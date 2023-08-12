import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, NotificationsService],
})
export class UsersModule {}
