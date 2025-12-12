import { OnModuleInit } from '@nestjs/common';
import { RbacSyncService } from './rbac-sync.service.js';
export declare class RbacModule implements OnModuleInit {
    private readonly rbacSyncService;
    constructor(rbacSyncService: RbacSyncService);
    onModuleInit(): Promise<void>;
}
