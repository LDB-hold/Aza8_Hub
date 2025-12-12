import { CustomDecorator } from '@nestjs/common';
import { PermissionKey } from '@aza8/core-domain';
export declare const REQUIRE_PERMISSIONS_METADATA_KEY = "require_permissions";
export declare function RequirePermissions(...permissions: PermissionKey[]): CustomDecorator<string>;
