/// <reference types="node" />
import { IncomingMessage } from 'http';
import { TenantContext } from '@aza8/core-domain';
export declare class TenantContextService {
    private readonly request;
    constructor(request: IncomingMessage & {
        tenantContext?: TenantContext;
    });
    setContext(context: TenantContext): void;
    getContext(): TenantContext;
}
