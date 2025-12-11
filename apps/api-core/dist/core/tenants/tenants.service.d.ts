import { PrismaService } from '../../database/prisma.service.js';
import { TenantContextService } from '../../tenancy/tenant-context.service.js';
export declare class TenantsService {
    private readonly prisma;
    private readonly tenantContext;
    constructor(prisma: PrismaService, tenantContext: TenantContextService);
    getCurrentTenant(): Promise<{
        tenant: null;
        context: import("@aza8/core-domain").TenantContext;
    } | {
        tenant: {
            id: string;
            slug: string;
            name: string;
            status: string;
            plan: string;
        };
        context: import("@aza8/core-domain").TenantContext;
    }>;
    listTenants(): Promise<{
        id: string;
        slug: string;
        name: string;
        status: string;
        plan: string;
    }[]>;
}
