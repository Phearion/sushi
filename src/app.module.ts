import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { RequestController } from './controllers/request.controller';
import { SaveDataController } from './controllers/saveData.controller';
import { PrometheusController } from './controllers/prometheus.controller'; // Include PrometheusController here
import { PrometheusService } from './controllers/prometheus.service';
import { CheckSafetyController } from './controllers/checkSafety.controller';

@Module({
    imports: [],
    controllers: [
        AppController,
        RequestController,
        SaveDataController,
        PrometheusController,
        CheckSafetyController,
    ], // Remove PrometheusService
    providers: [AppService, PrometheusService], // Include PrometheusService as a provider
})
export class AppModule {}
