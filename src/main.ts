import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { envs } from './config/envs';
import { LoggerHelper } from './common/helpers/logger.helper';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = envs.port;

  app.enableCors();
  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  LoggerHelper(
    `Server running on http://localhost:${port}/api/v1`,
    'Bootstrap',
    false,
  );

  await app.listen(port ?? 3000);
}
bootstrap();
