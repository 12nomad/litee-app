import { IsNumber, IsString } from 'class-validator';

export class EditRoomNameDto {
  @IsNumber()
  roomId: number;

  @IsString()
  title: string;
}
