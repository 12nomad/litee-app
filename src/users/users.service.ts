import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FollowUserDto } from './dtos/follow-user.dto';
import { CommonOutput } from '../common/entities/CommonOutput.entity';
import { EditUserDto } from './dtos/edit-user.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly socketService: SocketService,
  ) {}

  async getAuthUser(sub: number): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({
      where: { id: sub },
      include: { savedPosts: { select: { id: true } } },
    });
    const { password, ...rest } = user;
    return rest;
  }

  async getUserByUsername(username: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { username },
      include: {
        _count: { select: { following: true, followers: true, posts: true } },
        posts: true,
        savedPosts: true,
        followers: { select: { id: true } },
      },
    });
  }

  async searchUserByUsername(username: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: { username: { contains: username, mode: 'insensitive' } },
    });
  }

  async toggleFollow(
    sub: number,
    { id }: FollowUserDto,
  ): Promise<CommonOutput> {
    const following = await this.prisma.user.findFirst({
      where: { id: sub, following: { some: { id } } },
    });

    const updatedUser = await this.prisma.user.update({
      where: { id: sub },
      data: {
        following: {
          ...(following ? { disconnect: { id } } : { connect: { id } }),
        },
      },
    });

    if (!following && sub !== id) {
      const newNotif = await this.notificationsService.createNotif(
        'FOLLOW',
        sub,
        id,
        sub,
      );
      this.socketService.socket
        .to(newNotif.notifTo.username)
        .emit('NEW_FOLLOW', {
          userId: updatedUser.id,
          username: updatedUser.username,
          notif: newNotif,
        });
    }

    return {
      success: true,
    };
  }

  async editUser(
    sub: number,
    { description, name, profileImage, username }: EditUserDto,
  ): Promise<CommonOutput> {
    const userExists = await this.prisma.user.findUnique({
      where: { username },
    });

    if (userExists.id !== sub)
      throw new BadRequestException('Username is already taken...');

    await this.prisma.user.update({
      where: { id: sub },
      data: {
        description,
        name,
        profileImage,
      },
    });

    return {
      success: true,
    };
  }
}
