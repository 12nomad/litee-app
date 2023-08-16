import { Injectable } from '@nestjs/common';
import { Message } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dtos/create-message.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly socketService: SocketService,
  ) {}

  async createMessage(
    sub: number,
    { message, roomId }: CreateMessageDto,
  ): Promise<Message> {
    const newMessage = await this.prisma.message.create({
      data: {
        message,
        roomId,
        senderId: sub,
      },
      include: { sender: true, room: true },
    });

    const room = await this.prisma.room.update({
      where: { id: roomId },
      data: {
        latestMessage: { connect: { id: newMessage.id } },
        // hasSeenLatestMessage: false,
        seenBy: { set: [] },
      },
      include: { users: true },
    });

    room.users.forEach(async (user) => {
      if (user.id !== sub) {
        await this.notificationsService.createNotif(
          'MESSAGE',
          sub,
          user.id,
          roomId,
        );

        this.socketService.socket
          .to(user.username)
          .emit('INCOMING_MESSAGE', newMessage);
      }
    });

    return newMessage;
  }
}
