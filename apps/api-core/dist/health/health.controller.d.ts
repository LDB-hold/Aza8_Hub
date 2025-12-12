import { HealthService } from './health.service.js';
export declare class HealthController {
    private readonly healthService;
    constructor(healthService: HealthService);
    root(): {
        status: string;
    };
    health(): {
        status: string;
    };
    ready(): Promise<{
        status: string;
    }>;
}
