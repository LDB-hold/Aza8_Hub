import { TenantsService } from './tenants.service.js';
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    current(): Promise<{
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
    list(): Promise<{
        status: string;
        id: string;
        slug: string;
        name: string;
        plan: string;
    }[]>;
}
