import { Injectable } from '@nestjs/common';
import { TenantContext } from '@aza8/core-domain';
import { TenantContextStore } from './tenant-context.store.js';

const defaultContext: TenantContext = {
  tenantId: null,
  tenantSlug: null,
  isHubRequest: true
};

@Injectable()
export class TenantContextService {
  constructor(private readonly store: TenantContextStore) {}

  setContext(context: TenantContext) {
    this.store.runWithContext(context, () => {});
  }

  getContext(): TenantContext {
    const fromStore = this.store.getContext();
    return fromStore ?? { ...defaultContext };
  }
}
