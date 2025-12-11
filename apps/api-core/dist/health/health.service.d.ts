import { PrismaService } from '../database/prisma.service.js';
export declare class HealthService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    readiness(): Promise<boolean>;
}
