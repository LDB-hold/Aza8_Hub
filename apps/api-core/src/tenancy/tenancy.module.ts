import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { TenantContextService } from './tenant-context.service.js';
import { TenancyService } from './tenancy.service.js';
import { TenancyMiddleware } from './tenancy.middleware.js';
import { TenantContextStore } from './tenant-context.store.js';

@Global()
@Module({
  providers: [TenantContextService, TenancyService, TenantContextStore],
  exports: [TenantContextService, TenancyService, TenantContextStore]
})
export class TenancyModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenancyMiddleware).forRoutes('*');
  }
}
