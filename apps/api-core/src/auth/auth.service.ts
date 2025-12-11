import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import {
  BaseRole,
  CurrentUserContext,
  RoleScope,
  TenantContext,
  TenantMembership as DomainTenantMembership,
  User as DomainUser,
  UserStatus
} from '@aza8/core-domain';

import { PrismaService } from '../database/prisma.service.js';
import { AppConfigService } from '../config/app-config.service.js';
import { RbacService } from '../rbac/rbac.service.js';
import { AuthCallbackDto } from './dto/auth-callback.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: AppConfigService,
    private readonly rbacService: RbacService
  ) {}

  async handleCallback(payload: AuthCallbackDto) {
    const user = await this.prisma.user.upsert({
      where: { email: payload.email },
      create: {
        email: payload.email,
        name: payload.name,
        status: 'ACTIVE',
        authProvider: payload.provider,
        authProviderId: payload.providerId
      },
      update: {
        name: payload.name,
        authProvider: payload.provider,
        authProviderId: payload.providerId
      }
    });

    if (payload.tenantSlug) {
      const tenant = await this.ensureTenant(payload.tenantSlug, payload.tenantName ?? payload.tenantSlug);
      const role = await this.rbacService.ensureRole(BaseRole.TENANT_OWNER, RoleScope.TENANT);
      await this.ensureMembership(user.id, tenant.id, role.id);
    } else {
      const tenant = await this.ensureHubTenant();
      const role = await this.rbacService.ensureRole(BaseRole.AZA8_OPERATOR, RoleScope.GLOBAL_AZA8);
      await this.ensureMembership(user.id, tenant.id, role.id);
    }

    const token = await this.issueToken(user.id);
    return { token };
  }

  async validateToken(token: string, tenantContext: TenantContext): Promise<CurrentUserContext> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.apiConfig.authSecret
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        include: {
          memberships: {
            include: { role: true }
          }
        }
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const filteredMemberships = this.filterMemberships(user.memberships, tenantContext);
      const memberships = this.normalizeMemberships(filteredMemberships);
      const roles = memberships.map((membership) => membership.role.key);

      return {
        user: this.toDomainUser(user),
        memberships,
        tenantContext,
        roles
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async issueToken(userId: string): Promise<string> {
    return this.jwtService.signAsync({ sub: userId }, {
      secret: this.configService.apiConfig.authSecret,
      expiresIn: '7d'
    });
  }

  private async ensureTenant(slug: string, name: string) {
    return this.prisma.tenant.upsert({
      where: { slug },
      update: { name },
      create: {
        slug,
        name,
        status: 'ACTIVE',
        plan: 'STANDARD',
        config: {}
      }
    });
  }

  private async ensureHubTenant() {
    return this.ensureTenant('aza8', 'Aza8 HQ');
  }

  private async ensureMembership(userId: string, tenantId: string, roleId: string) {
    await this.prisma.tenantMembership.upsert({
      where: {
        tenantId_userId_roleId: {
          tenantId,
          userId,
          roleId
        }
      },
      update: {},
      create: {
        tenantId,
        userId,
        roleId
      }
    });
  }

  private filterMemberships(
    memberships: (Prisma.TenantMembershipGetPayload<{ include: { role: true } }>)[],
    tenantContext: TenantContext
  ) {
    if (tenantContext.isHubRequest) {
      return memberships.filter((membership) => membership.role.scope === RoleScope.GLOBAL_AZA8);
    }

    if (!tenantContext.tenantId) {
      return [];
    }

    return memberships.filter((membership) => membership.tenantId === tenantContext.tenantId);
  }

  private normalizeMemberships(
    memberships: (Prisma.TenantMembershipGetPayload<{ include: { role: true } }>)[]
  ): DomainTenantMembership[] {
    return memberships.map((membership) => ({
      ...membership,
      role: {
        ...membership.role,
        scope: membership.role.scope as RoleScope,
        key: membership.role.key as BaseRole,
        description: membership.role.description ?? undefined
      }
    }));
  }

  private toDomainUser(user: Prisma.UserGetPayload<{ include: { memberships: true } }>): DomainUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status as UserStatus,
      authProvider: user.authProvider,
      authProviderId: user.authProviderId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
}
