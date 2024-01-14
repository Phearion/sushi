import { Injectable } from '@nestjs/common';
import { Registry, collectDefaultMetrics, Counter } from 'prom-client';

@Injectable()
export class PrometheusService {
    private registry: Registry;
    private counter: Counter;

    constructor() {
        // Create a Prometheus registry and collect default metrics
        this.registry = new Registry();
        collectDefaultMetrics({ register: this.registry });

        // Create a new counter metric
        this.counter = new Counter({
            name: 'sushi_http_requests_total',
            help: 'Total number of HTTP requests',
            labelNames: ['method', 'route', 'status_code'],
            registers: [this.registry],
        });
    }

    async getMetrics() {
        // Add your custom metrics here
        // For example, you can return this.registry.metrics()
        return this.registry.metrics();
    }

    // Increment the counter metric
    incrementCounter(method: string, route: string, statusCode: number) {
        this.counter.inc({ method, route, status_code: statusCode });
    }
}
