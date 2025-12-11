import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantContext } from '@aza8/core-domain';

import { TenancyService } from './tenancy.service.js';

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
  constructor(private readonly tenancyService: TenancyService) {}

  async use(req: Request & { tenantContext?: TenantContext }, _res: Response, next: NextFunction) {
    const forwarded = req.headers['x-forwarded-host'];
    const hostHeader = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    const host = hostHeader || req.headers.host;

    req.tenantContext = await this.tenancyService.resolveContext(host as string | undefined);
    next();
  }
}
