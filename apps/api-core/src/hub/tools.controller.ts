import { Body, Controller, Get, Param, Put, UseGuards } from '@nestjs/common';
import { IsBoolean } from 'class-validator';
import { PrismaService } from '../database/prisma.service.js';
import { AuthGuard } from '../auth/auth.guard.js';
import { PermissionsGuard } from '../rbac/rbac.guard.js';
import { RequirePermissions } from '../rbac/rbac.decorator.js';

class ToolToggleDto {
  @IsBoolean()
  enabled!: boolean;
}

@Controller('hub/tenants/:tenantId/tools')
@UseGuards(AuthGuard)
export class HubToolsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('HUB_TOOLS_MANAGE')
  async list(@Param('tenantId') tenantId: string) {
    return this.prisma.toolInstall.findMany({
      where: { tenantId },
      include: { tool: true }
    });
  }

  @Put(':toolKey')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('HUB_TOOLS_MANAGE')
  async toggle(@Param('tenantId') tenantId: string, @Param('toolKey') toolKey: string, @Body() dto: ToolToggleDto) {
    return this.prisma.toolInstall.upsert({
      where: { tenantId_toolKey: { tenantId, toolKey } },
      update: { enabled: dto.enabled },
      create: {
        id: `ti_${tenantId}_${toolKey}`,
        tenantId,
        toolKey,
        enabled: dto.enabled
      }
    });
  }
}
