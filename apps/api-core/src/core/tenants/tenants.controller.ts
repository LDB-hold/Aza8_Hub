import { Controller, Get, UseGuards } from '@nestjs/common';
import { BaseRole } from '@aza8/core-domain';

import { AuthGuard } from '../../auth/guards/auth.guard.js';
import { RbacGuard } from '../../rbac/rbac.guard.js';
import { RequireRoles } from '../../rbac/rbac.decorator.js';
import { TenantsService } from './tenants.service.js';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get('current')
  @UseGuards(AuthGuard)
  current() {
    return this.tenantsService.getCurrentTenant();
  }

  @Get()
  @UseGuards(AuthGuard, RbacGuard)
  @RequireRoles(BaseRole.AZA8_ADMIN)
  list() {
    return this.tenantsService.listTenants();
  }
}
