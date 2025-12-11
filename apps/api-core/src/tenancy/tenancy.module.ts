import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { TenantContextService } from './tenant-context.service.js';
import { TenancyService } from './tenancy.service.js';
import { TenancyMiddleware } from './tenancy.middleware.js';

@Module({
  providers: [TenantContextService, TenancyService],
  exports: [TenantContextService, TenancyService]
})
export class TenancyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenancyMiddleware).forRoutes('*');
  }
}
