import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      signOptions: {
        algorithm: 'RS256',
        expiresIn: process.env.ACCESS_TOKEN_TTL,
      },
      privateKey: process.env.JWT_PRIVATE,
      publicKey: process.env.JWT_PUBLIC,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
