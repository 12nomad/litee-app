import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { NotifType, Notifications, User } from '@prisma/client';
import { CommonOutput } from '../common/entities/CommonOutput.entity';
import { GetResult } from '@prisma/client/runtime';
import { ViewedNotifDto } from './dtos/viewed-notif.dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getNotifs(sub: number): Promise<Notifications[]> {
    return await this.prisma.notifications.findMany({
      where: { notifToId: sub, notifType: { not: 'MESSAGE' } },
      include: { notifFrom: true, notifTo: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getNotifsCount(sub: number): Promise<number> {
    return await this.prisma.notifications.count({
      where: { notifType: { not: 'MESSAGE' }, viewed: false, notifToId: sub },
    });
  }

  async getMessageNotifsCount(sub: number): Promise<number> {
    return await this.prisma.notifications.count({
      where: { notifType: 'MESSAGE', viewed: false, notifToId: sub },
    });
  }

  async viewedNotif({ notifId }: ViewedNotifDto): Promise<CommonOutput> {
    await this.prisma.notifications.update({
      where: { id: notifId },
      data: { viewed: true },
    });

    return { success: true };
  }

  async deleteNotifs(sub: number): Promise<CommonOutput> {
    await this.prisma.notifications.deleteMany({
      where: { notifType: { not: 'MESSAGE' }, notifToId: sub },
    });

    return { success: true };
  }

  async createNotif(
    notifType: NotifType,
    notifFromId: number,
    notifToId: number,
    typeId: number,
  ): Promise<
    Notifications & {
      notifFrom: GetResult<User, unknown & {}>;
      notifTo: GetResult<User, unknown & {}>;
    }
  > {
    const notifExists = await this.prisma.notifications.findFirst({
      where: {
        notifType,
        notifFromId,
        notifToId,
        typeId,
      },
    });
    if (notifExists) {
      const [, newNotif] = await this.prisma.$transaction([
        this.prisma.notifications.delete({
          where: { id: notifExists.id },
        }),
        this.prisma.notifications.create({
          data: {
            notifType,
            notifFromId,
            notifToId,
            typeId,
          },
          include: {
            notifFrom: true,
            notifTo: true,
          },
        }),
      ]);
      return newNotif;
    } else {
      return await this.prisma.notifications.create({
        data: {
          notifType,
          notifFromId,
          notifToId,
          typeId,
        },
        include: {
          notifFrom: true,
          notifTo: true,
        },
      });
    }
  }
}
