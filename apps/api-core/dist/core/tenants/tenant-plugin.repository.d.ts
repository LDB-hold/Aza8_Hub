import { Prisma } from '@prisma/client';
import { AbstractTenantScopedRepository } from '../../common/tenant-scoped.repository.js';
import { PrismaService } from '../../database/prisma.service.js';
import { TenantContextService } from '../../tenancy/tenant-context.service.js';
type TenantPluginDelegate = PrismaService['tenantPlugin'];
export declare class TenantPluginRepository extends AbstractTenantScopedRepository<TenantPluginDelegate, Prisma.TenantPluginWhereInput, Prisma.TenantPluginUncheckedCreateInput, Prisma.TenantPluginUncheckedUpdateInput> {
    constructor(prisma: PrismaService, tenantContextService: TenantContextService);
    listPlugins(args?: Omit<Prisma.TenantPluginFindManyArgs, 'where'> & {
        where?: Omit<Prisma.TenantPluginWhereInput, 'tenantId'>;
    }): Promise<{
        id: string;
        tenantId: string;
        pluginId: string;
        status: string;
        config: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    upsertPlugin(pluginId: string, data: {
        status: string;
        config: Prisma.InputJsonValue;
    }): Promise<{
        id: string;
        tenantId: string;
        pluginId: string;
        status: string;
        config: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
    setStatus(pluginId: string, status: string): Promise<{
        id: string;
        tenantId: string;
        pluginId: string;
        status: string;
        config: Prisma.JsonValue;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
