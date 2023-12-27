import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { RequestController } from './controllers/request.controller';
import { SaveDataController } from './controllers/saveData.controller';
import { CheckSafetyController } from './controllers/checkSafety.controller';

@Module({
    imports: [],
    controllers: [
        AppController,
        RequestController,
        SaveDataController,
        CheckSafetyController,
    ],
    providers: [AppService],
})
export class AppModule {}
