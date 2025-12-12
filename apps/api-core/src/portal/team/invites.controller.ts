import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { IsEmail, IsString } from 'class-validator';
import { PrismaService } from '../../database/prisma.service.js';
import { AuthGuard } from '../../auth/auth.guard.js';
import { PermissionsGuard } from '../../rbac/rbac.guard.js';
import { RequirePermissions } from '../../rbac/rbac.decorator.js';
import { TenantContextService } from '../../tenancy/tenant-context.service.js';

class InviteCreateDto {
  @IsEmail()
  email!: string;

  @IsString()
  roleKey!: string;
}

class InviteAcceptDto {
  @IsEmail()
  email!: string;
}

@Controller('portal/invites')
export class PortalInvitesController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService
  ) {}

  @Get()
  @UseGuards(AuthGuard, PermissionsGuard)
  @RequirePermissions('TENANT_MEMBER_INVITE')
  async list() {
    const context = this.tenantContext.getContext();
    return this.prisma.invite.findMany({
      where: { tenantId: context.tenantId ?? undefined },
      orderBy: { createdAt: 'desc' }
    });
  }

  @Post()
  @UseGuards(AuthGuard, PermissionsGuard)
  @RequirePermissions('TENANT_MEMBER_INVITE')
  async create(@Body() dto: InviteCreateDto) {
    const context = this.tenantContext.getContext();
    return this.prisma.invite.create({
      data: {
        id: randomUUID(),
        tenantId: context.tenantId as string,
        email: dto.email,
        roleKey: dto.roleKey,
        token: randomUUID(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
      }
    });
  }

  @Post('accept/:token')
  async accept(@Param('token') token: string, @Body() dto: InviteAcceptDto) {
    const invite = await this.prisma.invite.findUnique({ where: { token } });
    if (!invite) {
      return { success: false, reason: 'invalid_token' };
    }

    await this.prisma.invite.update({
      where: { token },
      data: { acceptedAt: new Date() }
    });

    const user = await this.prisma.user.upsert({
      where: { email: dto.email },
      update: { name: dto.email.split('@')[0], type: 'PORTAL' },
      create: { id: `user_${token}`, email: dto.email, name: dto.email.split('@')[0], type: 'PORTAL' }
    });

    await this.prisma.membership.upsert({
      where: { tenantId_userId: { tenantId: invite.tenantId, userId: user.id } },
      update: { roleKey: invite.roleKey },
      create: { id: `m_${token}`, tenantId: invite.tenantId, userId: user.id, roleKey: invite.roleKey }
    });

    return { success: true };
  }
}
