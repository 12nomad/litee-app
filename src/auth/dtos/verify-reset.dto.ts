import { PickType } from '@nestjs/mapped-types';
import { IsString } from 'class-validator';
import { RegisterDto } from './register.dto';

export class VerifyResetDto extends PickType(RegisterDto, ['email']) {
  @IsString()
  reset: string;
}
