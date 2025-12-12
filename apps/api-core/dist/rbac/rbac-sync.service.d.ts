import { PrismaService } from '../database/prisma.service.js';
export declare class RbacSyncService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    syncBaseDefinitions(): Promise<void>;
    private syncRoles;
    private syncPermissions;
    private syncRolePermissions;
    private formatRoleName;
}
