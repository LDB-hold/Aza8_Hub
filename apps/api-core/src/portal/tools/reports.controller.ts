import { Controller, Get, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { AuthGuard } from '../../auth/auth.guard.js';
import { PermissionsGuard } from '../../rbac/rbac.guard.js';
import { RequirePermissions } from '../../rbac/rbac.decorator.js';

@Controller('portal/tools/reports')
@UseGuards(AuthGuard)
export class PortalReportsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('summary')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('TOOL_REPORTS_READ')
  async summary() {
    const [tasks, files, requests] = await Promise.all([
      this.prisma.task.count(),
      this.prisma.fileItem.count(),
      this.prisma.requestItem.count()
    ]);

    return {
      tasks,
      files,
      requests
    };
  }
}
