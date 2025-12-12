import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AppConfigService } from '../config/app-config.service.js';
import { TenantContextStore } from '../tenancy/tenant-context.store.js';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly tenantContextStore;
    private readonly logger;
    private readonly enforcementMode;
    private readonly readActions;
    private readonly uniqueActions;
    private readonly writeActions;
    constructor(appConfig: AppConfigService, tenantContextStore: TenantContextStore);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    private tenancyMiddleware;
    private isTenantScopedModel;
    private applyScopedWrite;
    private applyScopedWhere;
    private applyScopedUniqueWhere;
    private applyTenantIdToData;
    private extractTenantId;
    private logHubAccess;
}
