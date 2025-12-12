import { CustomDecorator } from '@nestjs/common';
import { BaseRole, PermissionCode } from '@aza8/core-domain';
export declare const REQUIRE_ROLES_METADATA_KEY = "rbac:roles";
export declare const REQUIRE_PERMISSIONS_METADATA_KEY = "rbac:permissions";
export declare const REQUIRE_ROLES_KEY = "rbac:roles";
export declare const REQUIRE_PERMISSIONS_KEY = "rbac:permissions";
export declare function RequireRoles(...roles: BaseRole[]): CustomDecorator<string>;
export declare function RequirePermissions(...permissions: PermissionCode[]): CustomDecorator<string>;
