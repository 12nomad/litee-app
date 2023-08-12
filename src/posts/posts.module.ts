import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { NotificationsService } from '../notifications/notifications.service';

@Module({
  controllers: [PostsController],
  providers: [PostsService, NotificationsService],
})
export class PostsModule {}
