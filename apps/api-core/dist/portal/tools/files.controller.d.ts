import { Response } from 'express';
import { PrismaService } from '../../database/prisma.service.js';
import { TenantContextService } from '../../tenancy/tenant-context.service.js';
declare class FileCreateDto {
    name: string;
    contentText: string;
}
export declare class PortalFilesController {
    private readonly prisma;
    private readonly tenantContext;
    constructor(prisma: PrismaService, tenantContext: TenantContextService);
    list(): Promise<{
        id: string;
        tenantId: string;
        name: string;
        contentText: string;
        createdAt: Date;
    }[]>;
    create(dto: FileCreateDto): Promise<{
        id: string;
        tenantId: string;
        name: string;
        contentText: string;
        createdAt: Date;
    }>;
    download(id: string, res: Response): Promise<void>;
}
export {};
