import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { MailerModule } from '@nestjs-modules/mailer';
import { PostsModule } from './posts/posts.module';
import { MessagesModule } from './messages/messages.module';
import { RoomsModule } from './rooms/rooms.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SocketGateway } from './socket.gateway';
import { JwtService } from '@nestjs/jwt';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('test', 'production', 'development'),
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.string().required(),
        JWT_PRIVATE: Joi.string().required(),
        JWT_PUBLIC: Joi.string().required(),
        ACCESS_TOKEN_TTL: Joi.string().required(),
        GMAIL_APP_PASSWORD: Joi.string().required(),
        GMAIL_APP_USER: Joi.string().required(),
        GOOGLE_CLIENT_ID: Joi.string().required(),
        GOOGLE_CLIENT_SECRET: Joi.string().required(),
        CLIENT_URL: Joi.string().required(),
        DIRECT_URL: Joi.string().required(),
      }),
    }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        secure: false,
        auth: {
          user: process.env.GMAIL_APP_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    CommonModule,
    PostsModule,
    MessagesModule,
    RoomsModule,
    NotificationsModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtService,
    SocketGateway,
  ],
})
export class AppModule {}
