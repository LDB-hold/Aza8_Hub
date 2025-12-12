import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { PermissionsGuard } from '../rbac/rbac.guard.js';
import { RequirePermissions } from '../rbac/rbac.decorator.js';

@Controller('portal/audit')
@UseGuards(AuthGuard)
export class PortalAuditController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('AUDIT_READ')
  async list() {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  }
}
