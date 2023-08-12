import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

import { AuthService } from './auth.service';
import {
  LoginDto,
  PasswordResetDto,
  RegisterDto,
  UpdatePasswordDto,
  VerifyResetDto,
} from './dtos';
import { Public } from './guards/public.decorator';
import { AuthUser } from './decorators/auth-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(loginDto, res);
  }

  @Public()
  @Post('register')
  register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.register(registerDto, res);
  }

  @Public()
  @Post('reset-password')
  passwordReset(@Body() passwordResetDto: PasswordResetDto) {
    return this.authService.passwordReset(passwordResetDto);
  }

  @Public()
  @Post('verify-reset')
  verifyReset(@Body() verifyResetDto: VerifyResetDto) {
    return this.authService.verifyReset(verifyResetDto);
  }

  @Public()
  @Post('update-password')
  updatePassword(@Body() updatePasswordDto: UpdatePasswordDto) {
    return this.authService.updatePassword(updatePasswordDto);
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
