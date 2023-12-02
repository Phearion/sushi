import { Body, Controller, Post, Res } from '@nestjs/common';
import RequestModel from '../assets/utils/models/Request';
import type { IRequestDocument } from '../typings/MongoTypes';

@Controller('saveData')
export class SaveDataController {
  @Post()
  async receiveString(
    @Body('data') data: Record<string, string>,
  ): Promise<void> {
    const userId = data.userId;
    const request = data.request;
    console.log('userId', userId);
    console.log('request', request);

    try {
      const data = (await RequestModel.findOne({ userId })) as IRequestDocument;
      console.log('data', data);
      if (data) {
        data.request.push(request);
        await data.save();
      } else {
        await RequestModel.create({
          userId,
          request: [request],
          aiAnswer: ['MOUAHAH'],
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}