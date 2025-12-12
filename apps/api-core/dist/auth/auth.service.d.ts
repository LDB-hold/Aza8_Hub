import { CurrentUserContext } from '@aza8/core-domain';
import { PrismaService } from '../database/prisma.service.js';
import { TenantContextService } from '../tenancy/tenant-context.service.js';
import { RbacService } from '../rbac/rbac.service.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthService {
    private readonly prisma;
    private readonly tenantContext;
    private readonly rbac;
    constructor(prisma: PrismaService, tenantContext: TenantContextService, rbac: RbacService);
    login(payload: LoginDto): Promise<CurrentUserContext>;
    buildUserContextByEmail(email: string, tenantContext?: import("@aza8/core-domain").TenantContext): Promise<CurrentUserContext>;
    buildUserContext(userId: string, tenantContext?: import("@aza8/core-domain").TenantContext): Promise<CurrentUserContext>;
}
