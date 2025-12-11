import { CanActivate, ExecutionContext } from '@nestjs/common';
import { TenantContextService } from '../../tenancy/tenant-context.service.js';
import { AuthService } from '../auth.service.js';
export declare class AuthGuard implements CanActivate {
    private readonly authService;
    private readonly tenantContext;
    constructor(authService: AuthService, tenantContext: TenantContextService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractToken;
}
