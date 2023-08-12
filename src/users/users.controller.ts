import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { AuthUser } from '../auth/decorators/auth-user.decorator';
import { User } from '@prisma/client';
import { FollowUserDto } from './dtos/follow-user.dto';
import { EditUserDto } from './dtos/edit-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAuthUser(@AuthUser('sub') sub: number): Promise<Partial<User>> {
    return this.usersService.getAuthUser(sub);
  }

  @Patch('follow-user')
  toggleFollow(
    @AuthUser('sub') sub: number,
    @Body() followUserDto: FollowUserDto,
  ) {
    return this.usersService.toggleFollow(sub, followUserDto);
  }

  @Get('search-user')
  searchUserByUsername(@Query('username') username: string): Promise<User[]> {
    return this.usersService.searchUserByUsername(username);
  }

  @Patch('edit-user')
  editUser(@AuthUser('sub') sub: number, @Body() editUserDto: EditUserDto) {
    return this.usersService.editUser(sub, editUserDto);
  }

  @Get(':username')
  getUserByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.getUserByUsername(username);
  }
}
