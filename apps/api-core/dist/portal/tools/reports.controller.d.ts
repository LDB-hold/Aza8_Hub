import { PrismaService } from '../../database/prisma.service.js';
export declare class PortalReportsController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    summary(): Promise<{
        tasks: number;
        files: number;
        requests: number;
    }>;
}
