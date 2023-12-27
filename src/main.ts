import { NestFactory } from '@nestjs/core';
import { dbConnect } from './assets/utils/mongoose';
import { AppModule } from './app.module';
import { config } from 'dotenv';

config({ path: './.env' });

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const connectToDb: Promise<void> = dbConnect.init();

    app.enableCors({
        origin: '*',
    });

    const port = process.env.PORT || 42125;
    await app.listen(port);
    await Promise.all([connectToDb, app]);
    console.log('Connected to DB');
    console.log('Server started! ', port);
}
bootstrap();
