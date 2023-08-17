import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      // origin: process.env.CLIENT_URL,
      // origin: 'http://localhost:5173',
      // origin: 'https://litee-app.vercel.app',
      origin: 'https://litee-app-client-production.up.railway.app',
      credentials: true,
    },
  });

  app.set('trust proxy', 1);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(Number(process.env.PORT), '0.0.0.0');
}
bootstrap();
