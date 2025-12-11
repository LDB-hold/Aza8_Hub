import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { TenantContext } from '@aza8/core-domain';

const defaultContext: TenantContext = {
  tenantId: null,
  tenantSlug: null,
  isHubRequest: false
};

@Injectable({ scope: Scope.REQUEST })
export class TenantContextService {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request & { tenantContext?: TenantContext }
  ) {}

  setContext(context: TenantContext) {
    this.request.tenantContext = context;
  }

  getContext(): TenantContext {
    return this.request.tenantContext ?? { ...defaultContext };
  }
}
