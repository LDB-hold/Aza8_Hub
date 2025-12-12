import { PrismaService } from '../../database/prisma.service.js';
import { TenantContextService } from '../../tenancy/tenant-context.service.js';
import { TaskStatus } from '@prisma/client';
declare class TaskCreateDto {
    title: string;
}
declare class TaskUpdateDto {
    title?: string;
    status?: TaskStatus;
}
export declare class PortalTasksController {
    private readonly prisma;
    private readonly tenantContext;
    constructor(prisma: PrismaService, tenantContext: TenantContextService);
    list(): Promise<{
        id: string;
        tenantId: string;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        assigneeUserId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(dto: TaskCreateDto): Promise<{
        id: string;
        tenantId: string;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        assigneeUserId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: TaskUpdateDto): Promise<{
        id: string;
        tenantId: string;
        title: string;
        status: import("@prisma/client").$Enums.TaskStatus;
        assigneeUserId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        success: boolean;
    }>;
}
export {};
