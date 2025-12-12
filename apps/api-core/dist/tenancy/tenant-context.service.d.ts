import { TenantContext } from '@aza8/core-domain';
import { TenantContextStore } from './tenant-context.store.js';
export declare class TenantContextService {
    private readonly store;
    constructor(store: TenantContextStore);
    setContext(context: TenantContext): void;
    getContext(): TenantContext;
}
