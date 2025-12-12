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
            status: string;
            id: string;
            slug: string;
            name: string;
            plan: string;
        };
        context: import("@aza8/core-domain").TenantContext;
    }>;
    listTenants(): Promise<{
        status: string;
        id: string;
        slug: string;
        name: string;
        plan: string;
    }[]>;
}
