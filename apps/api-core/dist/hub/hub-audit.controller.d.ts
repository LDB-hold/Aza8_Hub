import { PrismaService } from '../database/prisma.service.js';
export declare class HubAuditController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(): Promise<{
        id: string;
        tenantId: string | null;
        actorUserId: string;
        action: string;
        entity: string;
        entityId: string;
        metadataJson: import("@prisma/client").Prisma.JsonValue;
        createdAt: Date;
    }[]>;
}
