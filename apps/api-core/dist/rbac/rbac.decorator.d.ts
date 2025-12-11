import { BaseRole } from '@aza8/core-domain';
export declare const REQUIRE_ROLES_KEY = "require_roles";
export declare const RequireRoles: (...roles: BaseRole[]) => import("@nestjs/common").CustomDecorator<string>;
