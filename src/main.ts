import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.ALLOWED_DOMAINS?.split(','), // Allow these origins
    methods: 'GET,HEAD', // Allow these HTTP methods
    allowedHeaders: 'Content-Type, Accept', // Allow these headers
    credentials: true, // Allow cookies and credentials to be sent with requests
  });
  await app.listen(process.env.PORT || 3000);
}

bootstrap();
