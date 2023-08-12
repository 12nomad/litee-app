import { PickType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';

export class PasswordResetDto extends PickType(RegisterDto, ['email']) {}
