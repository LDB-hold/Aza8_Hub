import { PrismaService } from '../../database/prisma.service.js';
import { AuthenticatedRequest } from '../../auth/interfaces.js';
import { TenantContextService } from '../../tenancy/tenant-context.service.js';
declare class RequestCreateDto {
    title: string;
    description: string;
}
declare class RequestDecisionDto {
    note?: string;
}
export declare class PortalRequestsController {
    private readonly prisma;
    private readonly tenantContext;
    constructor(prisma: PrismaService, tenantContext: TenantContextService);
    list(): Promise<{
        id: string;
        tenantId: string;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        createdByUserId: string;
        decidedByUserId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(dto: RequestCreateDto, req: AuthenticatedRequest): Promise<{
        id: string;
        tenantId: string;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        createdByUserId: string;
        decidedByUserId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    approve(id: string, req: AuthenticatedRequest, _dto: RequestDecisionDto): Promise<{
        id: string;
        tenantId: string;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        createdByUserId: string;
        decidedByUserId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    reject(id: string, req: AuthenticatedRequest, _dto: RequestDecisionDto): Promise<{
        id: string;
        tenantId: string;
        title: string;
        description: string;
        status: import("@prisma/client").$Enums.RequestStatus;
        createdByUserId: string;
        decidedByUserId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
