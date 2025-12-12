import { TenantsService } from './tenants.service.js';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    current(): Promise<{
        tenant: null;
        context: import("@aza8/core-domain").TenantContext;
    } | {
        tenant: {
            slug: string;
            id: string;
            name: string;
            status: string;
            plan: string;
        };
        context: import("@aza8/core-domain").TenantContext;
    }>;
    list(): Promise<{
        slug: string;
        id: string;
        name: string;
        status: string;
        plan: string;
    }[]>;
}
