import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Req } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.fromCookies]),
      secretOrKey: configService.get<string>('JWT_PUBLIC'),
      ignoreExpiration: false,
    });
  }

  private static fromCookies(@Req() req: Request): string | null {
    return req.cookies['__litee_app_access_token'];
  }

  async validate(payload: { sub: number }) {
    return { sub: payload.sub };
  }
}
