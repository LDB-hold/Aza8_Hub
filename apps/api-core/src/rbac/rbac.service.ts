import { Injectable } from '@nestjs/common';
import { rolePermissionsMap, PermissionKey, RoleKey } from '@aza8/core-domain';

@Injectable()
export class RbacService {
  getPermissionsForRole(role: RoleKey | null | undefined): PermissionKey[] {
    if (!role) return [];
    return rolePermissionsMap[role] ?? [];
  }
}
