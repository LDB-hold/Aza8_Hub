import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { RbacModule } from '../rbac/rbac.module.js';
import { AuthGuard } from './auth.guard.js';

@Module({
  imports: [RbacModule],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard]
})
export class AuthModule {}
