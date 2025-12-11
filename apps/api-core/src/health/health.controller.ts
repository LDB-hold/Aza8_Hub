import { Controller, Get } from '@nestjs/common';

import { HealthService } from './health.service.js';

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Get('ready')
  async ready() {
    const healthy = await this.healthService.readiness();
    return {
      status: healthy ? 'ready' : 'degraded'
    };
  }
}
