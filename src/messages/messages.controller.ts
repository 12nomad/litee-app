import { Body, Controller, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { CreateMessageDto } from './dtos/create-message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post()
  createMessage(
    @AuthUser('sub') sub: number,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    return this.messagesService.createMessage(sub, createMessageDto);
  }
}
