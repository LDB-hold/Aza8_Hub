import { BaseRole, PermissionCode } from '@aza8/core-domain';
export declare const REQUIRE_ROLES_KEY = "require_roles";
export declare const REQUIRE_PERMISSIONS_KEY = "require_permissions";
export declare const RequireRoles: (...roles: BaseRole[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequirePermissions: (...permissions: PermissionCode[]) => import("@nestjs/common").CustomDecorator<string>;
