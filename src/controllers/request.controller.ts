import {Controller, Post, Body, Res, HttpStatus} from '@nestjs/common';
export const importDynamic = new Function('modulePath', 'return import(modulePath)');
const EventSource = require('eventsource');
globalThis.EventSource = EventSource;

@Controller('request')
export class RequestController {
  @Post()
  async receiveString(@Body('data') data: string, @Res() res): Promise<void> {
    console.log('Received string: ', data);
    const { client } = await importDynamic('@gradio/client');
    const C = await client('https://phanthive-bigbrain.hf.space/--replicas/2glcb/', {})
    const result = await C.predict("/predict", [data])
    res.status(HttpStatus.OK).json({ prediction: result.data[0]})
  }
}
