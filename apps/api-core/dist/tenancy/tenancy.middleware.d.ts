/// <reference types="node" />
import { NestMiddleware } from '@nestjs/common';
import { IncomingHttpHeaders, IncomingMessage, ServerResponse } from 'http';
import { TenantContext } from '@aza8/core-domain';
import { TenancyService } from './tenancy.service.js';
import { TenantContextStore } from './tenant-context.store.js';
type RequestWithContext = IncomingMessage & {
    headers: IncomingHttpHeaders & {
        host?: string;
    };
    tenantContext?: TenantContext;
};
type Response = ServerResponse;
type NextFunction = (err?: unknown) => void;
export declare class TenancyMiddleware implements NestMiddleware {
    private readonly tenancyService;
    private readonly tenantContextStore;
    constructor(tenancyService: TenancyService, tenantContextStore: TenantContextStore);
    use(req: RequestWithContext, _res: Response, next: NextFunction): Promise<void>;
}
export {};
