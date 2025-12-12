import { Injectable, Logger } from '@nestjs/common';
import {
  BASE_PERMISSIONS,
  BASE_ROLES,
  ROLE_PERMISSION_MATRIX,
  RoleCode,
  RoleDefinition
} from '@aza8/core-domain';

import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class RbacSyncService {
  private readonly logger = new Logger(RbacSyncService.name);

  constructor(private readonly prisma: PrismaService) {}

  async syncBaseDefinitions() {
    await this.syncRoles();
    await this.syncPermissions();
    await this.syncRolePermissions();
  }

  private async syncRoles() {
    for (const role of BASE_ROLES) {
      const existing = await this.prisma.role.findFirst({ where: { key: role.code } });

      if (!existing) {
        await this.prisma.role.create({
          data: {
            key: role.code,
            scope: role.scope,
            name: this.formatRoleName(role),
            description: role.description
          }
        });
        continue;
      }

      if (existing.scope !== role.scope || existing.description !== role.description || existing.name !== this.formatRoleName(role)) {
        await this.prisma.role.update({
          where: { id: existing.id },
          data: {
            scope: role.scope,
            description: role.description,
            name: this.formatRoleName(role)
          }
        });
      }
    }
  }

  private async syncPermissions() {
    for (const permission of BASE_PERMISSIONS) {
      const existing = await this.prisma.permission.findUnique({ where: { key: permission.code } });
      if (!existing) {
        await this.prisma.permission.create({
          data: {
            key: permission.code,
            description: permission.description
          }
        });
        continue;
      }

      if (existing.description !== permission.description) {
        await this.prisma.permission.update({
          where: { id: existing.id },
          data: { description: permission.description }
        });
      }
    }
  }

  private async syncRolePermissions() {
    const roles = await this.prisma.role.findMany({ where: { key: { in: BASE_ROLES.map((role) => role.code) } } });
    const permissions = await this.prisma.permission.findMany({ where: { key: { in: BASE_PERMISSIONS.map((permission) => permission.code) } } });

    const roleByCode = new Map<RoleCode, (typeof roles)[number]>();
    for (const role of roles) {
      roleByCode.set(role.key as RoleCode, role);
    }

    const permissionByCode = new Map<string, (typeof permissions)[number]>();
    for (const permission of permissions) {
      permissionByCode.set(permission.key, permission);
    }

    for (const matrix of ROLE_PERMISSION_MATRIX) {
      const role = roleByCode.get(matrix.roleCode);
      if (!role) {
        this.logger.warn(`Role ${matrix.roleCode} not found while syncing permissions`);
        continue;
      }

      const desiredPermissionIds = matrix.permissionCodes
        .map((code) => {
          const permission = permissionByCode.get(code);
          if (!permission) {
            this.logger.warn(`Permission ${code} missing for role ${matrix.roleCode}`);
          }
          return permission?.id;
        })
        .filter((id): id is string => Boolean(id));

      const existingRolePermissions = await this.prisma.rolePermission.findMany({
        where: { roleId: role.id }
      });

      const existingPermissionIds = new Set(existingRolePermissions.map((rp) => rp.permissionId));
      const desiredPermissionIdSet = new Set(desiredPermissionIds);

      for (const permissionId of desiredPermissionIds) {
        if (!existingPermissionIds.has(permissionId)) {
          await this.prisma.rolePermission.create({
            data: {
              roleId: role.id,
              permissionId
            }
          });
        }
      }

      for (const rolePermission of existingRolePermissions) {
        if (!desiredPermissionIdSet.has(rolePermission.permissionId)) {
          await this.prisma.rolePermission.delete({ where: { id: rolePermission.id } });
        }
      }
    }
  }

  private formatRoleName(role: RoleDefinition): string {
    return role.code.replaceAll('_', ' ');
  }
}
