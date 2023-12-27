import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { RequestController } from './controllers/request.controller';
import { SaveDataController } from './controllers/saveData.controller';
import { CheckRequestController } from './controllers/checkRequest.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    RequestController,
    SaveDataController,
    CheckRequestController,
  ],
  providers: [AppService],
})
export class AppModule {}
