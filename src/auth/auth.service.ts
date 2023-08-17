import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import {
  LoginDto,
  PasswordResetDto,
  RegisterDto,
  UpdatePasswordDto,
  VerifyResetDto,
} from './dtos';
import { CommonOutput } from '../common/entities/CommonOutput.entity';
import { Response } from 'express';
import { User, Verification } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  generate(length: number) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length),
      );
    }

    return result;
  }

  async setToken(sub: number, res: Response) {
    const at = await this.jwtService.signAsync(
      { sub },
      {
        secret: this.configService.get<string>('JWT_PRIVATE'),
      },
    );

    res.cookie('__litee_app_access_token', at, {
      secure: true,
      httpOnly: true,
      domain: '.railway.app',
      sameSite: 'lax',
      // domain: '.vercel.app',
    });
  }

  async register(
    { email, password, username }: RegisterDto,
    res: Response,
  ): Promise<CommonOutput> {
    const emailExists = await this.prisma.user.findUnique({ where: { email } });
    if (emailExists) throw new BadRequestException('E-mail is already used...');

    const usernameExists = await this.prisma.user.findUnique({
      where: { username },
    });
    if (usernameExists)
      throw new BadRequestException('Username is already used...');

    const hashed = await argon.hash(password);
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashed,
        username,
        // TODO: connect to existing user in seed.ts
        following: { connect: [{ id: 1 }, { id: 2 }, { id: 3 }] },
      },
    });

    await this.setToken(user.id, res);
    // const token = await this.jwtService.signAsync(
    //   { sub: user.id },
    //   {
    //     secret: this.configService.get<string>('JWT_PRIVATE'),
    //   },
    // );

    return {
      success: true,
      // token,
    };
  }

  async login(
    { email, password, username }: LoginDto,
    res: Response,
  ): Promise<CommonOutput> {
    let user: User;
    if (email) user = await this.prisma.user.findUnique({ where: { email } });
    else if (username)
      user = await this.prisma.user.findUnique({ where: { username } });

    if (!user) {
      throw new BadRequestException(
        'There is no account associated with that username/e-mail, please create an account before continuing...',
      );
    }

    const isMatch = await argon.verify(user.password, password);
    if (!isMatch) {
      throw new BadRequestException('Invalid credentials...');
    }

    await this.setToken(user.id, res);
    // const token = await this.jwtService.signAsync(
    //   { sub: user.id },
    //   {
    //     secret: this.configService.get<string>('JWT_PRIVATE'),
    //   },
    // );
    // console.log(token);

    return {
      success: true,
      // token,
    };
  }

  async passwordReset({ email }: PasswordResetDto): Promise<CommonOutput> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { verification: true },
    });
    if (!user) {
      throw new BadRequestException(
        'There is no account associated with that e-mail, please create an account before continuing...',
      );
    }

    let verification: Verification | null = null;
    if (user.verification) {
      verification = await this.prisma.verification.update({
        where: { userId: user.id },
        data: {
          reset: this.generate(5),
        },
      });
    } else {
      verification = await this.prisma.verification.create({
        data: {
          userId: user.id,
          reset: this.generate(5),
        },
      });
    }

    await this.mailerService.sendMail({
      to: user.email,
      from: {
        name: 'Litee App.',
        address: this.configService.get<string>('GMAIL_APP_USER') || '',
      },
      subject: 'Password Reset',
      html: `
        <div>
          <h3>Litee App.</h3>
          <p>Please use the provided code to reset your password: 👉 <strong>${verification.reset}</strong> 👈</p>
        </div>
      `,
    });
    return { success: true };
  }

  async verifyReset({ reset, email }: VerifyResetDto): Promise<CommonOutput> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { verification: true },
    });
    if (user?.verification?.reset !== reset) {
      throw new BadRequestException('The verification code does not match...');
    }

    await this.prisma.verification.delete({
      where: {
        userId: user.id,
      },
    });

    return { success: true };
  }

  async updatePassword({
    password,
    email,
  }: UpdatePasswordDto): Promise<CommonOutput> {
    const hashed = await argon.hash(password);

    await this.prisma.user.update({
      where: { email },
      data: {
        password: hashed,
      },
    });

    return { success: true };
  }

  logout(res: Response): CommonOutput {
    res.clearCookie('__litee_app_access_token');

    return { success: true };
  }
}
