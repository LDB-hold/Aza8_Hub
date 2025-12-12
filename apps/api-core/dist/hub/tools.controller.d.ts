import { PrismaService } from '../database/prisma.service.js';
declare class ToolToggleDto {
    enabled: boolean;
}
export declare class HubToolsController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(tenantId: string): Promise<({
        tool: {
            key: string;
            name: string;
        };
    } & {
        id: string;
        tenantId: string;
        toolKey: string;
        enabled: boolean;
    })[]>;
    toggle(tenantId: string, toolKey: string, dto: ToolToggleDto): Promise<{
        id: string;
        tenantId: string;
        toolKey: string;
        enabled: boolean;
    }>;
}
export {};
