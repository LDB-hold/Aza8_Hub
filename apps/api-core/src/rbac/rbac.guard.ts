import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { BaseRole } from '@aza8/core-domain';

import { AuthenticatedRequest } from '../auth/interfaces/auth-user.interface.js';
import { REQUIRE_ROLES_KEY } from './rbac.decorator.js';

@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<BaseRole[]>(REQUIRE_ROLES_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userContext = request.userContext;
    if (!userContext) {
      throw new UnauthorizedException();
    }

    return requiredRoles.some((role) => userContext.roles.includes(role));
  }
}
