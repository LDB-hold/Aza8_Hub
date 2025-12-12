import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard.js';
import { PermissionsGuard } from '../../rbac/rbac.guard.js';
import { RequirePermissions } from '../../rbac/rbac.decorator.js';
import { TenantsService } from './tenants.service.js';
import { IsString, MinLength } from 'class-validator';

class CreateTenantDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsString()
  @MinLength(2)
  slug!: string;
}

@Controller('hub/tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get('current')
  @UseGuards(AuthGuard)
  current() {
    return this.tenantsService.getCurrentTenant();
  }

  @Get()
  @UseGuards(AuthGuard, PermissionsGuard)
  @RequirePermissions('HUB_TENANT_READ')
  list() {
    return this.tenantsService.listTenants();
  }

  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @RequirePermissions('HUB_TENANT_WRITE')
  create(@Body() dto: CreateTenantDto) {
    return this.tenantsService.createTenant(dto);
  }
}
