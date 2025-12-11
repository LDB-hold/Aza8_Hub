import { BaseRole, RoleScope } from '@aza8/core-domain';
import { PrismaService } from '../database/prisma.service.js';
export declare class RbacService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    ensureRole(key: BaseRole, scope: RoleScope): Promise<{
        id: string;
        scope: string;
        key: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
