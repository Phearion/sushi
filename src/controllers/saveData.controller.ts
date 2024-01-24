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
import { PrometheusService } from './prometheus.service'; // Import PrometheusService

@Controller('saveData')
export class SaveDataController {
    constructor(private readonly prometheusService: PrometheusService) {} // Inject PrometheusService

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

        try {
            const existingData = (await RequestModel.findOne({
                ipAddress,
            })) as IRequestDocument;
            if (existingData) {
                existingData.request.push(request);
                await existingData.save();
            } else {
                await RequestModel.create({ ipAddress, request: [request] });
            }
            // Increment the HTTP requests counter metric using PrometheusService
            this.prometheusService.incrementCounter(
                req.method,
                req.route.path,
                HttpStatus.OK,
            );
            res.status(HttpStatus.OK).json({ message: 'Données sauvegardées' });
        } catch (error) {
            console.error('Error saving data:', error);
            // Increment the HTTP requests counter metric for failed requests
            this.prometheusService.incrementCounter(
                req.method,
                req.route.path,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
            throw new HttpException(
                'Erreur lors de la sauvegarde des données',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
