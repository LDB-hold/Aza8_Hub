import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { BaseRole, PermissionCode } from '@aza8/core-domain';

export const REQUIRE_ROLES_METADATA_KEY = 'rbac:roles';
export const REQUIRE_PERMISSIONS_METADATA_KEY = 'rbac:permissions';

// Aliases kept for backwards compatibility with existing metadata consumers.
export const REQUIRE_ROLES_KEY = REQUIRE_ROLES_METADATA_KEY;
export const REQUIRE_PERMISSIONS_KEY = REQUIRE_PERMISSIONS_METADATA_KEY;

export function RequireRoles(...roles: BaseRole[]): CustomDecorator<string> {
  return SetMetadata(REQUIRE_ROLES_METADATA_KEY, roles);
}

// Attach to controllers/handlers to enforce permission codes for the active context.
export function RequirePermissions(...permissions: PermissionCode[]): CustomDecorator<string> {
  return SetMetadata(REQUIRE_PERMISSIONS_METADATA_KEY, permissions);
}
