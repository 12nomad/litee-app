import { IsNumber } from 'class-validator';

export class EditLatestMessage {
  @IsNumber()
  roomId: number;

  @IsNumber()
  senderId: number;
}
