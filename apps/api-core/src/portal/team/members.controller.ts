import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { IsString } from 'class-validator';
import { PrismaService } from '../../database/prisma.service.js';
import { AuthGuard } from '../../auth/auth.guard.js';
import { PermissionsGuard } from '../../rbac/rbac.guard.js';
import { RequirePermissions } from '../../rbac/rbac.decorator.js';

class UpdateRoleDto {
  @IsString()
  roleKey!: string;
}

@Controller('portal/members')
@UseGuards(AuthGuard)
export class PortalMembersController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions('TENANT_MEMBER_READ')
  async list() {
    const memberships = await this.prisma.membership.findMany({
      include: { user: true }
    });

    return memberships.map((m) => ({
      id: m.id,
      userId: m.userId,
      tenantId: m.tenantId,
      roleKey: m.roleKey,
      email: m.user.email,
      name: m.user.name
    }));
  }

  @Patch(':userId/role')
  @UseGuards(PermissionsGuard)
  @RequirePermissions('TENANT_MEMBER_ROLE_UPDATE')
  async updateRole(@Param('userId') userId: string, @Body() dto: UpdateRoleDto) {
    await this.prisma.membership.updateMany({
      where: { userId },
      data: { roleKey: dto.roleKey }
    });
    return { success: true };
  }
}
