import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io';

@Injectable()
export class WsGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const client: Socket = context.switchToWs().getClient();

    const at = client.handshake.headers.cookie
      .split(';')
      .find((el) => el.trim().startsWith('__litee_app_access_token'));

    if (!at) return false;

    // const token = client.handshake.headers[
    //   '__litee_app_access_token'
    // ] as string;
    // if (!token) return false;

    const token = at.split('=')[1];
    const data = this.jwtService.verify(token, {
      publicKey: this.configService.get('JWT_PUBLIC'),
    });

    if (data && data.sub) {
      context.switchToHttp().getRequest().user = data;
      return true;
    }

    return false;
  }
}
