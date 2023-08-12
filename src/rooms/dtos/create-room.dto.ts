import { IsArray, IsNumber } from 'class-validator';

export class CreateRoomDto {
  @IsArray()
  usersArray: string[];
}
