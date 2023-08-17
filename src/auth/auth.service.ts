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

  // async setToken(sub: number, res: Response) {
  //   const at = await this.jwtService.signAsync(
  //     { sub },
  //     {
  //       secret: this.configService.get<string>('JWT_PRIVATE'),
  //     },
  //   );

  //   res.cookie('__litee_app_access_token', at, {
  //     secure: true,
  //     httpOnly: true,
  //     domain: 'localhost',
  //     // domain: '.vercel.app',
  //   });
  // }

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

    // await this.setToken(user.id, res);
    const token = this.jwtService.sign(
      { sub: user.id },
      {
        secret: `
        -----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAsEpRuFODTtQvWF125Sb6Ml1KRGKfG6TJSiYYwFGLXeggNEKs
SszoT2rVpvEimJ0Dp1IExZk6Oj+txI1qhAiA5ru8143tgzJ/f6sFt1/1pniwcYe8
/A85S37ftXayzxmfIgUDIWtRpEx/lXKUJEF+jI4rm7GKlTVVoUIzX/9b02lD9KK8
w8I09oLNi5x03ssl8S72jfvbbyJO8jchaTpedaeBgSOfMCr1Z7A7UYipwSbCgJco
Ue9W9/LUGB8dCr/6/3Vv83b98BRLfOOrfguo0CNIud//Bf1onVERyCtOk/hA+EMw
GxQTtD9tQVNKV1XAFm8v3uBx8NZKuWHJYoOLBwIDAQABAoIBAQCvlTYTespbpyaI
wn56+flUVGp19iw2okgB3DPmyNEgdOQuaQGldrUi9Gtb3OvySOCstBognN7LyUTP
cXJXkwifxvjtUGTxuUgX5kTJQYAvkCFc0i8+dgNA2FsEJ/csIn7GqWtWy8cC91ZT
iU1XVwwt/iQc7BX1SqvA82isAnB4/MBvdoNNKYDhvGB+2dWxngOYeJSW0leM0MNx
Ul5hdYwUjY7RXO8+hyRNRiURCGQHmpjVcIp32XCyl51nu/mVwlq2cwQh+DKjx1Th
WzacXEY2xAilVpmhJstvRpkv/fU3ehdixkQRE6UloK+eSUaIOFqZQ8GK0ItRAIrU
OoPFi3MBAoGBAPoAIqftowe/ZBpadnkvXaPvKdRTozQ/PBt1EbAyIYMjHZXObui6
QsNRqFGAs6wIdUHCdgdHLt8lrTqaPMGExNlFcpuuwrzbMap+gFTLk6didNLDIe5y
zTmvX88op9Njtcicbl3mgfdnHceER7s+S+WAGRLWAnDIglpRN6uZQXJHAoGBALSF
WWB119YoyMUEKZza7FCS8UbYa4AavjxUG6F4qAZObhPU2+n5KiS/92KPOmRv0kvd
+llyFlEipYuwaK+uYIkI7+BKBV17+ipsWcjz1AMERFPuimzBx3ElpDtTdH6kW/ub
Sh1oMTrtM6LnK8dBA+Gn88mY51SSJmHzmXnBUsFBAoGBAMnWOCSZ4AjORZRdOs9G
JXTID15kFByHfRCx6JD3OEU2oZkj7Dkqv+IPWDRNE0IuJfTsefwQRVBVi9EHW0vl
1EOSJSB57LEqyqNatGNBZLk77ROIBSoNN5F9/H001qH9G3OWkChxhLZoYwuEyaDr
f70POa8SZzAFQfCHJ8n71nHbAoGAVcyvj05TWMGnsyRoVtoiyaUdsmt4pLmRQ4FC
ZLvBOMYcQabBI3K+2hq3jQvAWC5hyJdnvw2fl86c2kjtaNq7nUY3JOZpqGYdn/5B
qmZhlVF43F+bQVfU4G1goqXmz6503aCQWGvGQlitWzb+ssSvAJjgIShgguy3+4RZ
pOoC2EECgYA49oFqY6Z3Igs+XWRIp5OAhPImfZU0lR6TToUGSAK7L8T5CWFQWbHD
8SWbGTI7jLPWSlmtNwErdfS9g+KnjFTHuEDHmGkR1aL7UvGTDGJVzEcIJBxHfVbx
nesmrqA1TwgHpsrpKCRopwVbMrk5syq3WVmZEITOMTr2xmgMoNd9nA==
-----END RSA PRIVATE KEY-----
        `,
      },
    );

    return {
      success: true,
      token,
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

    // await this.setToken(user.id, res);
    const token = this.jwtService.sign(
      { sub: user.id },
      {
        secret: `
        -----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEAsEpRuFODTtQvWF125Sb6Ml1KRGKfG6TJSiYYwFGLXeggNEKs
SszoT2rVpvEimJ0Dp1IExZk6Oj+txI1qhAiA5ru8143tgzJ/f6sFt1/1pniwcYe8
/A85S37ftXayzxmfIgUDIWtRpEx/lXKUJEF+jI4rm7GKlTVVoUIzX/9b02lD9KK8
w8I09oLNi5x03ssl8S72jfvbbyJO8jchaTpedaeBgSOfMCr1Z7A7UYipwSbCgJco
Ue9W9/LUGB8dCr/6/3Vv83b98BRLfOOrfguo0CNIud//Bf1onVERyCtOk/hA+EMw
GxQTtD9tQVNKV1XAFm8v3uBx8NZKuWHJYoOLBwIDAQABAoIBAQCvlTYTespbpyaI
wn56+flUVGp19iw2okgB3DPmyNEgdOQuaQGldrUi9Gtb3OvySOCstBognN7LyUTP
cXJXkwifxvjtUGTxuUgX5kTJQYAvkCFc0i8+dgNA2FsEJ/csIn7GqWtWy8cC91ZT
iU1XVwwt/iQc7BX1SqvA82isAnB4/MBvdoNNKYDhvGB+2dWxngOYeJSW0leM0MNx
Ul5hdYwUjY7RXO8+hyRNRiURCGQHmpjVcIp32XCyl51nu/mVwlq2cwQh+DKjx1Th
WzacXEY2xAilVpmhJstvRpkv/fU3ehdixkQRE6UloK+eSUaIOFqZQ8GK0ItRAIrU
OoPFi3MBAoGBAPoAIqftowe/ZBpadnkvXaPvKdRTozQ/PBt1EbAyIYMjHZXObui6
QsNRqFGAs6wIdUHCdgdHLt8lrTqaPMGExNlFcpuuwrzbMap+gFTLk6didNLDIe5y
zTmvX88op9Njtcicbl3mgfdnHceER7s+S+WAGRLWAnDIglpRN6uZQXJHAoGBALSF
WWB119YoyMUEKZza7FCS8UbYa4AavjxUG6F4qAZObhPU2+n5KiS/92KPOmRv0kvd
+llyFlEipYuwaK+uYIkI7+BKBV17+ipsWcjz1AMERFPuimzBx3ElpDtTdH6kW/ub
Sh1oMTrtM6LnK8dBA+Gn88mY51SSJmHzmXnBUsFBAoGBAMnWOCSZ4AjORZRdOs9G
JXTID15kFByHfRCx6JD3OEU2oZkj7Dkqv+IPWDRNE0IuJfTsefwQRVBVi9EHW0vl
1EOSJSB57LEqyqNatGNBZLk77ROIBSoNN5F9/H001qH9G3OWkChxhLZoYwuEyaDr
f70POa8SZzAFQfCHJ8n71nHbAoGAVcyvj05TWMGnsyRoVtoiyaUdsmt4pLmRQ4FC
ZLvBOMYcQabBI3K+2hq3jQvAWC5hyJdnvw2fl86c2kjtaNq7nUY3JOZpqGYdn/5B
qmZhlVF43F+bQVfU4G1goqXmz6503aCQWGvGQlitWzb+ssSvAJjgIShgguy3+4RZ
pOoC2EECgYA49oFqY6Z3Igs+XWRIp5OAhPImfZU0lR6TToUGSAK7L8T5CWFQWbHD
8SWbGTI7jLPWSlmtNwErdfS9g+KnjFTHuEDHmGkR1aL7UvGTDGJVzEcIJBxHfVbx
nesmrqA1TwgHpsrpKCRopwVbMrk5syq3WVmZEITOMTr2xmgMoNd9nA==
-----END RSA PRIVATE KEY-----
        `,
      },
    );
    console.log(token);

    return {
      success: true,
      token,
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
