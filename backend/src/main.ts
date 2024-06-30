import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { swagger } from './swagger';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(json({ limit: '1mb' }));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  swagger(app);
  await app.listen(3000);
}
bootstrap();
