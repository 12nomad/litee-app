import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { Comment, Post } from '@prisma/client';
import { PostIdDto } from './dtos/post-id.dto';
import { CommonOutput } from '../common/entities/CommonOutput.entity';
import { RepostDto } from './dtos/repost.dto';
import { CommentPostDto } from './dtos/comment-post.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { SocketService } from '../socket/socket.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
    private readonly socketService: SocketService,
  ) {}

  async getFeedPosts(sub: number, page: number = 1): Promise<Post[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: sub },
      select: { following: true },
    });

    const posts = await this.prisma.post.findMany({
      where: {
        userId: { in: [...user.following.map((user) => user.id), sub] },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        _count: {
          select: { likes: true, repostUsers: true, comments: true },
        },
        likes: { select: { id: true } },
        repostUsers: { select: { id: true } },
        comments: { select: { userId: true } },
        repost: { include: { user: true } },
      },
      skip: (page - 1) * 5,
      take: 5,
    });

    return posts;
  }

  async getPostById(postId: number): Promise<Post> {
    return await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        user: true,
        _count: { select: { comments: true, likes: true, repostUsers: true } },
        comments: { include: { user: true } },
        likes: true,
        repostUsers: true,
        repost: { include: { user: true } },
      },
    });
  }

  async createPost(
    sub: number,
    { description, media }: CreatePostDto,
  ): Promise<CommonOutput> {
    await this.prisma.post.create({
      data: { description, media, userId: sub },
    });

    return { success: true };
  }

  async toggleLike(sub: number, { postId }: PostIdDto): Promise<CommonOutput> {
    const likeExists = await this.prisma.post.findFirst({
      where: { likes: { some: { id: sub } }, id: postId },
    });

    const updatedPost = await this.prisma.post.update({
      where: { id: postId },
      data: {
        likes: {
          ...(likeExists
            ? { disconnect: { id: sub } }
            : { connect: { id: sub } }),
        },
      },
    });

    if (!likeExists && sub !== updatedPost.userId) {
      const newNotif = await this.notificationsService.createNotif(
        'LIKE',
        sub,
        updatedPost.userId,
        postId,
      );

      this.socketService.socket.to(newNotif.notifTo.username).emit('NEW_LIKE', {
        postId: updatedPost.id,
        username: newNotif.notifFrom.username,
        notif: newNotif,
      });
    }

    return { success: true };
  }

  async repost(
    sub: number,
    { postId, comment }: RepostDto,
  ): Promise<CommonOutput> {
    const [createdPost, updatedPost] = await this.prisma.$transaction([
      this.prisma.post.create({
        data: {
          description: comment ? comment : '',
          isRepost: true,
          userId: sub,
          repostId: postId,
        },
      }),
      this.prisma.post.update({
        where: { id: postId },
        data: { repostUsers: { connect: { id: sub } } },
      }),
    ]);

    if (sub !== updatedPost.userId) {
      const newNotif = await this.notificationsService.createNotif(
        'REPOST',
        sub,
        updatedPost.userId,
        createdPost.id,
      );

      this.socketService.socket
        .to(newNotif.notifTo.username)
        .emit('NEW_REPOST', {
          postId: createdPost.id,
          username: newNotif.notifFrom.username,
          notif: newNotif,
        });
    }

    return { success: true };
  }

  async undoRepost(sub: number, { postId }: PostIdDto): Promise<CommonOutput> {
    const repost = await this.prisma.post.findFirst({
      where: { AND: [{ userId: sub }, { repostId: postId }] },
    });

    await this.prisma.$transaction([
      this.prisma.post.delete({
        where: { id: repost.id },
      }),
      this.prisma.post.update({
        where: { id: postId },
        data: { repostUsers: { disconnect: { id: sub } } },
      }),
    ]);

    return { success: true };
  }

  async commentPost(
    sub: number,
    { postId, comment }: CommentPostDto,
  ): Promise<Comment> {
    const createdComment = await this.prisma.comment.create({
      data: { userId: sub, comment, postId },
      include: { user: true, post: true },
    });

    if (sub !== createdComment.post.userId) {
      const newNotif = await this.notificationsService.createNotif(
        'REPLY',
        sub,
        createdComment.post.userId,
        createdComment.postId,
      );

      this.socketService.socket
        .to(newNotif.notifTo.username)
        .emit('NEW_REPLY', {
          postId: createdComment.postId,
          username: newNotif.notifFrom.username,
          notif: newNotif,
        });
    }

    return createdComment;
  }

  async toggleSavePost(
    sub: number,
    { postId }: PostIdDto,
  ): Promise<CommonOutput> {
    const user = await this.prisma.user.findFirst({
      where: { id: sub, savedPosts: { some: { id: postId } } },
    });

    await this.prisma.user.update({
      where: { id: sub },
      data: {
        savedPosts: {
          ...(user
            ? { disconnect: { id: postId } }
            : { connect: { id: postId } }),
        },
      },
    });

    return { success: true };
  }

  async deletePost({ postId }: PostIdDto): Promise<CommonOutput> {
    await this.prisma.post.delete({
      where: { id: postId },
    });

    return { success: true };
  }
}
