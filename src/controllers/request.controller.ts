import { Controller, Post, Body } from '@nestjs/common';

@Controller('request')
export class RequestController {
  @Post()
  receiveString(@Body('data') data: string): string {
    console.log(data); // This will log the received string to the console
    return 'Request received!';
  }
}
