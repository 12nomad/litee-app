import { PickType } from '@nestjs/mapped-types';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

import { RegisterDto } from './register.dto';

export class LoginDto extends PickType(RegisterDto, ['password'] as const) {
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @MinLength(2)
  @IsOptional()
  username?: string;
}
