import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './app.service';
import { RequestController } from './controllers/request.controller';

@Module({
  imports: [],
  controllers: [AppController, RequestController],
  providers: [AppService],
})
export class AppModule {}
