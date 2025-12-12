import { PrismaService } from '../../database/prisma.service.js';
import { TenantContextService } from '../../tenancy/tenant-context.service.js';
declare class InviteCreateDto {
    email: string;
    roleKey: string;
}
declare class InviteAcceptDto {
    email: string;
}
export declare class PortalInvitesController {
    private readonly prisma;
    private readonly tenantContext;
    constructor(prisma: PrismaService, tenantContext: TenantContextService);
    list(): Promise<{
        id: string;
        tenantId: string;
        email: string;
        roleKey: string;
        token: string;
        expiresAt: Date;
        acceptedAt: Date | null;
        createdAt: Date;
    }[]>;
    create(dto: InviteCreateDto): Promise<{
        id: string;
        tenantId: string;
        email: string;
        roleKey: string;
        token: string;
        expiresAt: Date;
        acceptedAt: Date | null;
        createdAt: Date;
    }>;
    accept(token: string, dto: InviteAcceptDto): Promise<{
        success: boolean;
        reason: string;
    } | {
        success: boolean;
        reason?: undefined;
    }>;
}
export {};
