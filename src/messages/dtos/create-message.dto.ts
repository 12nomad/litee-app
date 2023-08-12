import { IsNumber, IsString } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  roomId: number;

  @IsString()
  message: string;
}
