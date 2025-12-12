import { SetMetadata } from '@nestjs/common';
import { BaseRole, PermissionCode } from '@aza8/core-domain';

export const REQUIRE_ROLES_KEY = 'require_roles';
export const REQUIRE_PERMISSIONS_KEY = 'require_permissions';

export const RequireRoles = (...roles: BaseRole[]) => SetMetadata(REQUIRE_ROLES_KEY, roles);
export const RequirePermissions = (...permissions: PermissionCode[]) =>
  SetMetadata(REQUIRE_PERMISSIONS_KEY, permissions);
