import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { RbacModule } from '../rbac/rbac.module.js';
import { TenancyModule } from '../tenancy/tenancy.module.js';
import { TenantsController } from './tenants/tenants.controller.js';
import { TenantsService } from './tenants/tenants.service.js';
import { TenantMembershipRepository } from './tenants/tenant-membership.repository.js';
import { TenantPluginRepository } from './tenants/tenant-plugin.repository.js';
import { MeController } from './me/me.controller.js';

@Module({
  imports: [AuthModule, RbacModule, TenancyModule],
  controllers: [MeController, TenantsController],
  providers: [TenantsService, TenantMembershipRepository, TenantPluginRepository]
})
export class CoreDomainModule {}
