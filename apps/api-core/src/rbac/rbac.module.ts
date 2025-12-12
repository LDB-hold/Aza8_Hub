import { Global, Module } from '@nestjs/common';
import { RbacService } from './rbac.service.js';
import { PermissionsGuard } from './rbac.guard.js';

@Global()
@Module({
  providers: [RbacService, PermissionsGuard],
  exports: [RbacService, PermissionsGuard]
})
export class RbacModule {}
