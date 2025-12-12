import { Injectable } from '@nestjs/common';
import {
  BASE_PERMISSIONS,
  BASE_ROLES,
  BaseRole,
  CurrentUserContext,
  PermissionCode,
  RoleScope,
  TenantContext,
  TenantMembership as DomainTenantMembership
} from '@aza8/core-domain';

import { PrismaService } from '../database/prisma.service.js';

const roleDefinitionsByCode = new Map(BASE_ROLES.map((role) => [role.code, role]));

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureRole(key: BaseRole, scope: RoleScope) {
    const definition = roleDefinitionsByCode.get(key);
    if (!definition) {
      throw new Error(`Unknown role code: ${key}`);
    }

    if (definition.scope !== scope) {
      throw new Error(`Role ${key} is not allowed for scope ${scope}`);
    }

    const existing = await this.prisma.role.findFirst({ where: { key } });
    const formattedName = this.formatRoleName(definition.code);

    if (existing) {
      const requiresUpdate =
        existing.scope !== definition.scope ||
        existing.name !== formattedName ||
        existing.description !== definition.description;

      if (requiresUpdate) {
        await this.prisma.role.update({
          where: { id: existing.id },
          data: { scope: definition.scope, name: formattedName, description: definition.description }
        });
      }

      return existing;
    }

    return this.prisma.role.create({
      data: {
        key,
        scope: definition.scope,
        name: formattedName,
        description: definition.description
      }
    });
  }

  // Computes effective roles and permissions for the current request scope.
  async getEffectiveRolesAndPermissionsForRequest(
    userId: string,
    tenantContext: TenantContext
  ): Promise<Pick<CurrentUserContext, 'memberships' | 'roles' | 'permissions'>> {
    const memberships = await this.resolveMemberships(userId, tenantContext);
    const roles = this.collectRoles(memberships);
    const permissions = this.collectPermissions(memberships, tenantContext);

    return { memberships, roles, permissions };
  }

  async getEffectiveAccessForUser(
    userId: string,
    tenantContext: TenantContext
  ): Promise<Pick<CurrentUserContext, 'memberships' | 'roles' | 'permissions'>> {
    return this.getEffectiveRolesAndPermissionsForRequest(userId, tenantContext);
  }

  private async resolveMemberships(
    userId: string,
    tenantContext: TenantContext
  ): Promise<DomainTenantMembership[]> {
    if (!tenantContext.isHubRequest && !tenantContext.tenantId) {
      return [];
    }

    const memberships = await this.prisma.tenantMembership.findMany({
      where: {
        userId,
        ...(tenantContext.isHubRequest
          ? { role: { scope: RoleScope.GLOBAL_AZA8 } }
          : { tenantId: tenantContext.tenantId ?? undefined, role: { scope: RoleScope.TENANT } })
      },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    });

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

  private collectPermissions(
    memberships: DomainTenantMembership[],
    tenantContext: TenantContext
  ): PermissionCode[] {
    const scope = tenantContext.isHubRequest ? RoleScope.GLOBAL_AZA8 : RoleScope.TENANT;
    const permissionCodes = memberships.flatMap((membership) =>
      (membership.role.permissions ?? []).map((rp) => rp.permission.key as PermissionCode)
    );

    const uniqueCodes = Array.from(new Set(permissionCodes));
    return uniqueCodes.filter((code) => {
      const permissionDefinition = BASE_PERMISSIONS.find((permission) => permission.code === code);
      if (!permissionDefinition) {
        return false;
      }

      if (permissionDefinition.scope === RoleScope.PLUGIN) {
        return true;
      }

      return permissionDefinition.scope === scope;
    }) as PermissionCode[];
  }

  private collectRoles(memberships: DomainTenantMembership[]): BaseRole[] {
    return Array.from(new Set(memberships.map((membership) => membership.role.key)));
  }

  private formatRoleName(code: BaseRole) {
    return code.replaceAll('_', ' ');
  }
}
