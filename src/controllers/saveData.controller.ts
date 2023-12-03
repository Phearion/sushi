import { Body, Controller, Post, Res, HttpStatus, Req } from '@nestjs/common';
import RequestModel from '../assets/utils/models/Request';
import type { IRequestDocument } from '../typings/MongoTypes';

@Controller('saveData')
export class SaveDataController {
  @Post()
  async receiveString(
    @Body('data') data: Record<string, string>,
    @Req() req,
    @Res() res,
  ): Promise<void> {
    const request = data.request;
    const ipAddress = req.ip;

    if (!request) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Erreur lors de la sauvegarde des données',
      });
      return;
    }

    try {
      const data = (await RequestModel.findOne({
        ipAddress,
      })) as IRequestDocument;
      if (data) {
        data.request.push(request);
        await data.save();
      } else {
        await RequestModel.create({
          ipAddress: ipAddress,
          request: [request],
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
