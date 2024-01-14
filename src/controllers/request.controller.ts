import {
    Controller,
    Post,
    Body,
    Res,
    HttpStatus,
    HttpException,
} from '@nestjs/common';
import { getFiles } from './archive/getFiles';

export const importDynamic = new Function(
    'modulePath',
    'return import(modulePath)',
);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const EventSource = require('eventsource');
globalThis.EventSource = EventSource;

@Controller('request')
export class RequestController {
    @Post()
    async receiveString(@Body('data') data: string, @Res() res): Promise<void> {
        if (!data) {
            throw new HttpException('No data provided', HttpStatus.BAD_REQUEST);
        }

        try {
            const { client } = await importDynamic('@gradio/client');
            const C = await client(
                'https://phanthive-phanthive-bigbrain.hf.space/--replicas/9278f/',
                {},
            );
            const result = await C.predict('/predict', [data]);
            const files = await getFiles(result.data[0]);
            res.status(HttpStatus.OK).json({ files });
        } catch (error) {
            console.error('Error during prediction:', error);
            throw new HttpException(
                'Error processing the request',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
