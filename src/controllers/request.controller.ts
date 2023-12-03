import {Controller, Post, Body, Res, HttpStatus} from '@nestjs/common';
import { getFiles } from './archive/getFiles';

export const importDynamic = new Function('modulePath', 'return import(modulePath)');
const EventSource = require('eventsource');
globalThis.EventSource = EventSource;

@Controller('request')
export class RequestController {
  @Post()
  async receiveString(@Body('data') data: string, @Res() res): Promise<void> {
    console.log('Received string: ', data);
    const { client } = await importDynamic('@gradio/client');
    const C = await client('https://phanthive-phanthive-bigbrain.hf.space/--replicas/9q8sg/', {})
    const result = await C.predict("/predict", [data])
    const files = await getFiles(result.data[0]);
    console.log(files);

    if (typeof files === 'string') {
      // No resources were found
      res.status(HttpStatus.NOT_FOUND).json({ message: files });
    } else {
      // Files were found
      res.status(HttpStatus.OK).json({ prediction: result.data[0], files: files });
    }
  }
}
