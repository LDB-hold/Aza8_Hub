import { Module } from '@nestjs/common';

import { AuthModule } from '../auth/auth.module.js';
import { RbacModule } from '../rbac/rbac.module.js';
import { TenancyModule } from '../tenancy/tenancy.module.js';
import { MeController } from './me/me.controller.js';

@Module({
  imports: [AuthModule, RbacModule, TenancyModule],
  controllers: [MeController],
  providers: []
})
export class CoreDomainModule {}
