import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RoleKey, CurrentUserContext } from '@aza8/core-domain';

import { PrismaService } from '../database/prisma.service.js';
import { TenantContextService } from '../tenancy/tenant-context.service.js';
import { RbacService } from '../rbac/rbac.service.js';
import { LoginDto } from './dto/login.dto.js';

const HUB_ROLE_BY_EMAIL: Record<string, RoleKey> = {
  'aza8_admin@aza8.com': 'AZA8_ADMIN',
  'aza8_support@aza8.com': 'AZA8_SUPPORT'
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService,
    private readonly rbac: RbacService
  ) {}

  async login(payload: LoginDto): Promise<CurrentUserContext> {
    const tenantContext = this.tenantContext.getContext();
    return this.buildUserContextByEmail(payload.email, tenantContext);
  }

  async buildUserContextByEmail(email: string, tenantContext = this.tenantContext.getContext()): Promise<CurrentUserContext> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.buildUserContext(user.id, tenantContext);
  }

  async buildUserContext(userId: string, tenantContext = this.tenantContext.getContext()): Promise<CurrentUserContext> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (tenantContext.isHubRequest) {
      if (user.type !== 'HUB') {
        throw new UnauthorizedException('Hub access denied');
      }
      const role = HUB_ROLE_BY_EMAIL[user.email] ?? 'AZA8_SUPPORT';
      const permissions = this.rbac.getPermissionsForRole(role);
      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          type: user.type as 'HUB' | 'PORTAL',
          createdAt: user.createdAt
        },
        membership: null,
        tenantContext,
        role,
        permissions
      };
    }

    if (!tenantContext.tenantId) {
      throw new UnauthorizedException('Tenant missing');
    }

    if (user.type !== 'PORTAL') {
      throw new UnauthorizedException('Portal access denied');
    }

    const membership = await this.prisma.membership.findUnique({
      where: { tenantId_userId: { tenantId: tenantContext.tenantId, userId: user.id } }
    });

    if (!membership) {
      throw new UnauthorizedException('Membership not found for tenant');
    }

    const role = membership.roleKey as RoleKey;
    const permissions = this.rbac.getPermissionsForRole(role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type as 'HUB' | 'PORTAL',
        createdAt: user.createdAt
      },
      membership: {
        id: membership.id,
        tenantId: membership.tenantId,
        userId: membership.userId,
        roleKey: membership.roleKey as RoleKey
      },
      tenantContext,
      role,
      permissions
    };
  }
}
