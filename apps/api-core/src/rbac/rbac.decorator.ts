import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { PermissionKey } from '@aza8/core-domain';

export const REQUIRE_PERMISSIONS_METADATA_KEY = 'require_permissions';

export function RequirePermissions(...permissions: PermissionKey[]): CustomDecorator<string> {
  return SetMetadata(REQUIRE_PERMISSIONS_METADATA_KEY, permissions);
}
