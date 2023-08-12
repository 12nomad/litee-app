import { PickType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';

export class UpdatePasswordDto extends PickType(RegisterDto, [
  'password',
  'email',
]) {}
