import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS to allow Frontend (Vite)
  app.enableCors({
    origin: 'http://localhost:5173', // The address of React
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();