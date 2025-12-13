import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'http';
import { TenantContext } from '@aza8/core-domain';

import { TenancyService } from './tenancy.service.js';
import { TenantContextStore } from './tenant-context.store.js';

type RequestWithContext = IncomingMessage & {
  headers: IncomingHttpHeaders & { host?: string };
  tenantContext?: TenantContext;
};

type Response = ServerResponse;
type NextFunction = (err?: unknown) => void;

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
  private readonly logger = new Logger(TenancyMiddleware.name);

  constructor(
    private readonly tenancyService: TenancyService,
    private readonly tenantContextStore: TenantContextStore
  ) {}

  async use(req: RequestWithContext, _res: Response, next: NextFunction) {
    const forwarded = req.headers['x-forwarded-host'];
    const hostHeader = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    const host = hostHeader || req.headers.host;

    this.logger.debug(`Resolving tenancy for host=${host}`);
    req.tenantContext = await this.tenancyService.resolveContext(host as string | undefined);

    return this.tenantContextStore.runWithContext(req.tenantContext, () => next());
  }
}
