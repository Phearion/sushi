import { NestFactory } from '@nestjs/core';
import { dbConnect } from './assets/utils/mongoose';
import { AppModule } from './app.module';
import { config } from 'dotenv';

config({ path: './.env' });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const connectToDb: Promise<void> = dbConnect.init();

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://ipsa-scrypt.github.io/big-brain/',
    ],
  });
  await app.listen(process.env.VITE_PORT || 42125);
  await Promise.all([connectToDb, app]);
  console.log('Connected to DB');
  console.log('Server started! ', 'http://localhost:42125');
}
bootstrap();
