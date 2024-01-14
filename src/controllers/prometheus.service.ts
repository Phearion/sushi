import { Injectable } from '@nestjs/common';
import { Registry, collectDefaultMetrics } from 'prom-client';

@Injectable()
export class PrometheusService {
  private registry: Registry;

  constructor() {
    // Create a Prometheus registry and collect default metrics
    this.registry = new Registry();
    collectDefaultMetrics({ register: this.registry });
  }

  async getMetrics() {
    // Add your custom metrics here
    // For example, you can return this.registry.metrics()
    return this.registry.metrics();
  }
}
