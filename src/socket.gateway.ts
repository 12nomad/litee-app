import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

import { WsGuard } from './auth/guards/ws-auth.guard';
import { SocketService } from './socket/socket.service';
import { AuthUser } from './auth/decorators/auth-user.decorator';

@UseGuards(WsGuard)
@WebSocketGateway({
  cors: {
    // origin: process.env.CLIENT_URL,
    // origin: 'http://localhost:5173',
    origin: 'https://litee-app-client-production.up.railway.app',
    credentials: true,
  },
})
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  public server: Server;

  private logger: Logger = new Logger('SocketGateway');

  constructor(private socketService: SocketService) {}

  afterInit(server: Server) {
    this.socketService.socket = server;
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  // TODO: Socket
  @SubscribeMessage('CONNECT')
  connect(
    @MessageBody('username') username: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(username);
  }

  @SubscribeMessage('DISCONNECT')
  disconnect(
    @MessageBody('username') username: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.leave(username);
  }

  // FIXME: disabling isTyping feature for now (too many requests)
  // @SubscribeMessage('USER_TYPING')
  // userTyping(@MessageBody('roomId') roomId: number): void {
  //   this.io.to(roomId.toString()).emit('IS_TYPING', { isTyping: true });
  // }

  // @SubscribeMessage('USER_NOT_TYPING')
  // userNotTyping(@MessageBody('roomId') roomId: number): void {
  //   this.io.to(roomId.toString()).emit('IS_TYPING', { isTyping: false });
  // }
}
