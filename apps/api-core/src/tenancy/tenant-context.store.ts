import { AsyncLocalStorage } from 'async_hooks';
import { Injectable } from '@nestjs/common';
import { TenantContext } from '@aza8/core-domain';

@Injectable()
export class TenantContextStore {
  private readonly storage = new AsyncLocalStorage<TenantContext>();

  runWithContext<T>(context: TenantContext, cb: () => T): T {
    return this.storage.run(context, cb);
  }

  getContext(): TenantContext | undefined {
    return this.storage.getStore();
  }
}
