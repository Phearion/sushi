import { Controller, Get } from '@nestjs/common';
import { PrometheusService } from './prometheus.service';

@Controller('prometheus')
export class PrometheusController {
  constructor(private readonly prometheusService: PrometheusService) {}

  @Get('metrics')
  async getMetrics() {
    return this.prometheusService.getMetrics();
  }
}
