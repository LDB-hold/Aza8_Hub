import { PrismaService } from '../../database/prisma.service.js';
declare class UpdateRoleDto {
    roleKey: string;
}
export declare class PortalMembersController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(): Promise<{
        id: string;
        userId: string;
        tenantId: string;
        roleKey: string;
        email: string;
        name: string;
    }[]>;
    updateRole(userId: string, dto: UpdateRoleDto): Promise<{
        success: boolean;
    }>;
}
export {};
