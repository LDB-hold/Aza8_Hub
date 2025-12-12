import { Module, OnModuleInit } from '@nestjs/common';

import { DatabaseModule } from '../database/database.module.js';
import { RbacGuard } from './rbac.guard.js';
import { RbacSyncService } from './rbac-sync.service.js';
import { RbacService } from './rbac.service.js';

@Module({
  imports: [DatabaseModule],
  providers: [RbacService, RbacGuard, RbacSyncService],
  exports: [RbacService, RbacGuard, RbacSyncService]
})
export class RbacModule implements OnModuleInit {
  constructor(private readonly rbacSyncService: RbacSyncService) {}

  async onModuleInit() {
    await this.rbacSyncService.syncBaseDefinitions();
  }
}
