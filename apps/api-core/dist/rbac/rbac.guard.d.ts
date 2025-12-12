import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TenantContextService } from '../tenancy/tenant-context.service.js';
export declare class RbacGuard implements CanActivate {
    private readonly reflector;
    private readonly tenantContextService;
    constructor(reflector: Reflector, tenantContextService: TenantContextService);
    canActivate(context: ExecutionContext): boolean;
}
