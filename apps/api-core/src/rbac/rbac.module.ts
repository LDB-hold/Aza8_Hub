import { Module } from '@nestjs/common';

import { RbacGuard } from './rbac.guard.js';
import { RbacService } from './rbac.service.js';

@Module({
  providers: [RbacService, RbacGuard],
  exports: [RbacService, RbacGuard]
})
export class RbacModule {}
