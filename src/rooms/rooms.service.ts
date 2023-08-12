import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dtos/create-room.dto';
import { Room } from '@prisma/client';
import { EditRoomNameDto } from './dtos/edit-room-name.dto';
import { CommonOutput } from '../common/entities/CommonOutput.entity';
import { EditLatestMessage } from './dtos/edit-latest-message.dto';

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async createRoom(
    sub: number,
    { usersArray }: CreateRoomDto,
  ): Promise<number> {
    const room = await this.prisma.room.create({
      data: {
        users: {
          connect: [
            ...usersArray.map((username) => ({ username })),
            { id: sub },
          ],
        },
        isGroupRoom: usersArray.length > 1 ? true : false,
      },
    });

    return room.id;
  }

  async getRoom(sub: number, roomId: number): Promise<Room> {
    const room = await this.prisma.room.findFirst({
      where: {
        AND: [{ id: roomId }, { users: { some: { id: sub } } }],
      },
      include: {
        latestMessage: true,
        messages: {
          include: { sender: true },
          orderBy: { createdAt: 'asc' },
          take: 10,
        },
        users: true,
        seenBy: true,
      },
    });

    if (!room) throw new ForbiddenException('You cannot access this chat...');

    return room;
  }

  async getRoomByUserId(sub: number, id: number): Promise<Room> {
    const room = await this.prisma.room.findFirst({
      where: {
        isGroupRoom: false,
        users: { every: { OR: [{ id: sub }, { id }] } },
      },
      include: { seenBy: true },
    });

    if (!room) {
      return await this.prisma.room.create({
        data: {
          users: { connect: [{ id }, { id: sub }] },
        },
        include: { seenBy: true },
      });
    }

    return room;
  }

  async getRooms(sub: number): Promise<Room[]> {
    return await this.prisma.room.findMany({
      where: {
        users: { some: { id: sub } },
      },
      include: { users: true, latestMessage: true, seenBy: true },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async editRoomName({
    roomId,
    title,
  }: EditRoomNameDto): Promise<CommonOutput> {
    await this.prisma.room.update({
      where: {
        id: roomId,
      },
      data: { roomName: title },
    });

    return { success: true };
  }

  async editLatestMessage(
    sub: number,
    { roomId, senderId }: EditLatestMessage,
  ): Promise<CommonOutput> {
    const notif = await this.prisma.notifications.findFirst({
      where: {
        viewed: false,
        notifType: 'MESSAGE',
        notifFromId: senderId,
        notifToId: sub,
      },
    });

    await this.prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        // hasSeenLatestMessage: true
        seenBy: { connect: { id: sub } },
      },
    });

    if (notif)
      await this.prisma.notifications.update({
        where: { id: notif.id },
        data: { viewed: true },
      });

    return { success: true };
  }
}
