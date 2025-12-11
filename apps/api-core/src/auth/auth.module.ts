import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AppConfigModule } from '../config/app-config.module.js';
import { AppConfigService } from '../config/app-config.service.js';
import { RbacModule } from '../rbac/rbac.module.js';
import { TenancyModule } from '../tenancy/tenancy.module.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { AuthGuard } from './guards/auth.guard.js';

@Module({
  imports: [
    AppConfigModule,
    RbacModule,
    TenancyModule,
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        secret: configService.apiConfig.authSecret,
        signOptions: { expiresIn: '7d' }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard]
})
export class AuthModule {}
