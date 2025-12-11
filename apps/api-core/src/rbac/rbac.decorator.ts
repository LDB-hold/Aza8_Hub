import { SetMetadata } from '@nestjs/common';
import { BaseRole } from '@aza8/core-domain';

export const REQUIRE_ROLES_KEY = 'require_roles';
export const RequireRoles = (...roles: BaseRole[]) => SetMetadata(REQUIRE_ROLES_KEY, roles);
