import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
export const importDynamic = new Function(
  'modulePath',
  'return import(modulePath)',
);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EventSource = require('eventsource');
globalThis.EventSource = EventSource;

@Controller('request')
export class RequestController {
  @Post()
  async receiveString(@Body('data') data: string, @Res() res): Promise<void> {
    console.log('Received string: ', data);
    const { client } = await importDynamic('@gradio/client');
    const C = await client(
      'https://phanthive-phanthive-bigbrain.hf.space/--replicas/9278f/',
      {},
    );
    const result = await C.predict('/predict', [data]);
    res.status(HttpStatus.OK).json({ prediction: result.data[0] });
  }
}
