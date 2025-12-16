import { TenantsService } from './tenants.service.js';
declare class CreateTenantDto {
    name: string;
    slug: string;
}
export declare class TenantsController {
    private readonly tenantsService;
    constructor(tenantsService: TenantsService);
    current(): Promise<{
        tenant: null;
        context: import("@aza8/core-domain").TenantContext;
    } | {
        tenant: {
            id: string;
            slug: string;
            name: string;
            createdAt: Date;
        };
        context: import("@aza8/core-domain").TenantContext;
    }>;
    list(): Promise<{
        id: string;
        slug: string;
        name: string;
        createdAt: Date;
    }[]>;
    create(dto: CreateTenantDto): Promise<{
        id: string;
        slug: string;
        name: string;
        createdAt: Date;
    }>;
}
export {};
