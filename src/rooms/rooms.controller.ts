import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { CreateRoomDto } from './dtos/create-room.dto';
import { EditRoomNameDto } from './dtos/edit-room-name.dto';
import { EditLatestMessage } from './dtos/edit-latest-message.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  createRoom(
    @AuthUser('sub') sub: number,
    @Body() createRoomDto: CreateRoomDto,
  ) {
    return this.roomsService.createRoom(sub, createRoomDto);
  }

  @Get()
  getRooms(@AuthUser('sub') sub: number) {
    return this.roomsService.getRooms(sub);
  }

  @Get('room')
  getRoomByUserId(
    @AuthUser('sub') sub: number,
    @Query('id', ParseIntPipe) id: number,
  ) {
    return this.roomsService.getRoomByUserId(sub, id);
  }

  @Post('edit-room')
  editRoomName(@Body() editRoomNameDto: EditRoomNameDto) {
    return this.roomsService.editRoomName(editRoomNameDto);
  }

  @Post('edit-latest-message')
  editLatestMessage(
    @AuthUser('sub') sub: number,
    @Body() editLatestMessage: EditLatestMessage,
  ) {
    return this.roomsService.editLatestMessage(sub, editLatestMessage);
  }

  @Get(':id')
  getRoom(@AuthUser('sub') sub: number, @Param('id', ParseIntPipe) id: number) {
    return this.roomsService.getRoom(sub, id);
  }
}
