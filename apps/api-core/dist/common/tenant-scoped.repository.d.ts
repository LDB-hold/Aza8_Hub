import { PrismaService } from '../database/prisma.service.js';
import { TenantContextService } from '../tenancy/tenant-context.service.js';
export declare abstract class AbstractTenantScopedRepository<TDelegate, TWhereInput extends {
    tenantId?: unknown;
}, TCreateInput extends {
    tenantId?: unknown;
}, TUpdateInput extends {
    tenantId?: unknown;
}> {
    protected readonly prisma: PrismaService;
    protected readonly tenantContextService: TenantContextService;
    protected readonly model: TDelegate;
    protected constructor(prisma: PrismaService, tenantContextService: TenantContextService, model: TDelegate);
    protected getTenantId(): string;
    protected scopeWhere(where?: Omit<TWhereInput, 'tenantId'>): TWhereInput;
    protected scopeCreate(data: Omit<TCreateInput, 'tenantId'>): TCreateInput;
    protected scopeUpdate(data: Omit<TUpdateInput, 'tenantId'>): TUpdateInput;
}
