import { Module } from '@nestjs/common';

import { AppConfigModule } from './config/app-config.module.js';
import { HealthModule } from './health/health.module.js';
import { TenancyModule } from './tenancy/tenancy.module.js';
import { AuthModule } from './auth/auth.module.js';
import { RbacModule } from './rbac/rbac.module.js';
import { CoreDomainModule } from './core/core-domain.module.js';
import { HubModule } from './hub/hub.module.js';
import { PortalModule } from './portal/portal.module.js';
import { DatabaseModule } from './database/database.module.js';

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    HealthModule,
    TenancyModule,
    AuthModule,
    RbacModule,
    CoreDomainModule,
    HubModule,
    PortalModule
  ]
})
export class AppModule {}
