import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionKey } from '@aza8/core-domain';
import { REQUIRE_PERMISSIONS_METADATA_KEY } from './rbac.decorator.js';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<PermissionKey[]>(REQUIRE_PERMISSIONS_METADATA_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!required || required.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userContext = request.userContext;

    if (!userContext) {
      throw new UnauthorizedException('Session missing');
    }

    const hasAll = required.every((perm) => userContext.permissions.includes(perm));
    if (!hasAll) {
      throw new ForbiddenException('Missing permissions');
    }

    return true;
  }
}
