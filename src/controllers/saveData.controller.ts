import {
  Body,
  Controller,
  Post,
  Res,
  HttpStatus,
  Req,
  HttpException,
} from '@nestjs/common';
import RequestModel from '../assets/utils/models/Request';
import type { IRequestDocument } from '../typings/MongoTypes';

// Import Prometheus metrics from 'prom-client'
import { Histogram, Counter } from 'prom-client';

const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// Define a Histogram metric to record request durations
const httpRequestsDuration = new Histogram({
  name: 'http_requests_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

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
      throw new HttpException(
        'Request data is missing',
        HttpStatus.BAD_REQUEST,
      );
    }

    const labels = {
      method: req.method,
      route: req.route.path,
      status_code: HttpStatus.OK,
    };

    try {
      const startTime = process.hrtime(); // Record the start time

      const existingData = (await RequestModel.findOne({
        ipAddress,
      })) as IRequestDocument;
      if (existingData) {
        existingData.request.push(request);
        await existingData.save();
      } else {
        await RequestModel.create({ ipAddress, request: [request] });
      }
      res.status(HttpStatus.OK).json({ message: 'Données sauvegardées' });

      // Increment the HTTP requests counter for successful requests
      httpRequestsTotal.inc(labels);

      // Record the request duration
      const durationInMilliseconds = process.hrtime(startTime);
      httpRequestsDuration.observe(
        labels,
        durationInMilliseconds[0] + durationInMilliseconds[1] / 1e9,
      );
    } catch (error) {
      console.error('Error saving data:', error);
      throw new HttpException(
        'Erreur lors de la sauvegarde des données',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

      // Increment the HTTP requests counter for failed requests
      httpRequestsTotal.inc({
        ...labels,
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }
}
