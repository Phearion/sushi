import { NestFactory } from '@nestjs/core';
import { dbConnect } from './assets/utils/mongoose';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import * as expressPromBundle from 'express-prom-bundle';

config({ path: './.env' });

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const connectToDb: Promise<void> = dbConnect.init();

    // Create an instance of express-prom-bundle
    const metricsMiddleware = expressPromBundle({
        // Optional configuration options:
        autoregister: false, // Disable automatic metrics registration
        includeMethod: true, // Include HTTP method labels in metrics
    });

    app.enableCors({
        origin: '*',
    });

    const port = process.env.PORT || 42125;

    app.use('/metrics', metricsMiddleware);
    await app.listen(port);
    await Promise.all([connectToDb, app]);
    console.log('Connected to DB');
    console.log('Server started! ', port);
}
bootstrap();
