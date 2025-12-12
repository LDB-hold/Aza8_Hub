import { TenantContext } from '@aza8/core-domain';
export declare class TenantContextStore {
    private readonly storage;
    runWithContext<T>(context: TenantContext, cb: () => T): T;
    getContext(): TenantContext | undefined;
}
