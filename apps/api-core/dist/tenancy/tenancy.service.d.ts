import { TenantContext } from '@aza8/core-domain';
import { PrismaService } from '../database/prisma.service.js';
export declare class TenancyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    resolveContext(hostHeader?: string | null): Promise<TenantContext>;
    private isInternalHost;
    private findTenantBySlug;
}
