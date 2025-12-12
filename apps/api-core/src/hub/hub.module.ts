import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { RbacModule } from '../rbac/rbac.module.js';
import { TenantsController } from '../core/tenants/tenants.controller.js';
import { TenantsService } from '../core/tenants/tenants.service.js';
import { HubToolsController } from './tools.controller.js';
import { HubAuditController } from './hub-audit.controller.js';

@Module({
  imports: [AuthModule, RbacModule],
  controllers: [TenantsController, HubToolsController, HubAuditController],
  providers: [TenantsService]
})
export class HubModule {}
