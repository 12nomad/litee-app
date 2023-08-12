import { IsNumber } from 'class-validator';

export class ViewedNotifDto {
  @IsNumber()
  notifId: number;
}
