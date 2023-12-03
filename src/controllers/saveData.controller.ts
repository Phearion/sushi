import { Body, Controller, Post, Res, HttpStatus } from '@nestjs/common';
import RequestModel from '../assets/utils/models/Request';
import type { IRequestDocument } from '../typings/MongoTypes';

@Controller('saveData')
export class SaveDataController {
  @Post()
  async receiveString(
    @Body('data') data: Record<string, string>,
    @Res() res,
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
      res.status(HttpStatus.OK).json({ message: 'Données sauvegardées' });
    } catch (error) {
      console.log(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Erreur lors de la sauvegarde des données',
      });
    }
  }
}
