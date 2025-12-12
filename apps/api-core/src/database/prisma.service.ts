import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { TenantContext } from '@aza8/core-domain';
import { AppConfigService } from '../config/app-config.service.js';
import { TenantContextStore } from '../tenancy/tenant-context.store.js';
import { TENANT_SCOPED_MODELS, TenantScopedModelName } from '../tenancy/tenant-scoped-models.js';

type EnforcementMode = 'warn' | 'strict';
type PrismaAction =
  | 'findUnique'
  | 'findMany'
  | 'findFirst'
  | 'create'
  | 'update'
  | 'updateMany'
  | 'delete'
  | 'deleteMany'
  | 'upsert'
  | 'createMany'
  | 'count'
  | 'aggregate'
  | 'groupBy';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('PrismaTenancy');
  private readonly enforcementMode: EnforcementMode;

  private readonly readActions = new Set<PrismaAction>([
    'findUnique',
    'findMany',
    'findFirst',
    'count',
    'aggregate',
    'groupBy'
  ]);

  private readonly uniqueActions = new Set<PrismaAction>(['findUnique', 'update', 'delete', 'upsert']);

  private readonly writeActions = new Set<PrismaAction>([
    'create',
    'createMany',
    'update',
    'updateMany',
    'delete',
    'deleteMany',
    'upsert'
  ]);

  constructor(
    appConfig: AppConfigService,
    private readonly tenantContextStore: TenantContextStore
  ) {
    super();
    this.enforcementMode = appConfig.apiConfig.tenancyEnforcementMode;
  }

  async onModuleInit() {
    this.$use(this.tenancyMiddleware.bind(this));
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  private async tenancyMiddleware(
    params: Prisma.MiddlewareParams,
    next: (params: Prisma.MiddlewareParams) => Promise<unknown>
  ) {
    if (!this.isTenantScopedModel(params.model)) {
      return next(params);
    }

    const tenantContext = this.tenantContextStore.getContext();

    if (!tenantContext) {
      const message = `Tenant context missing for model ${params.model} action ${params.action}`;
      if (this.enforcementMode === 'strict') {
        throw new Error(`${message}; enforcement mode is strict`);
      }
      this.logger.warn(`${message}; skipping enforcement`);
      return next(params);
    }

    if (tenantContext.isHubRequest) {
      this.logHubAccess(params, tenantContext);
      return next(params);
    }

    if (!tenantContext.tenantId) {
      const message = `Tenant ID missing in portal context for model ${params.model}`;
      if (this.enforcementMode === 'strict') {
        throw new Error(message);
      }
      this.logger.warn(message);
      return next(params);
    }

    if (this.readActions.has(params.action)) {
      if (this.uniqueActions.has(params.action)) {
        params.args = this.applyScopedUniqueWhere(params.args, tenantContext, params.model, params.action);
      } else {
        const scopedArgs = params.args ? { ...params.args } : {};
        scopedArgs.where = this.applyScopedWhere(
          scopedArgs.where,
          tenantContext,
          params.model,
          params.action
        );
        params.args = scopedArgs;
      }
    } else if (this.writeActions.has(params.action)) {
      params.args = this.applyScopedWrite(params.args, tenantContext, params.model, params.action);
    }

    return next(params);
  }

  private isTenantScopedModel(model?: string): model is TenantScopedModelName {
    return Boolean(model && (TENANT_SCOPED_MODELS as readonly string[]).includes(model));
  }

  private applyScopedWrite(
    args: Record<string, any> | undefined,
    tenantContext: TenantContext,
    model: string,
    action: PrismaAction
  ) {
    const tenantId = tenantContext.tenantId as string;
    const scopedArgs = args ? { ...args } : {};

    if (action === 'createMany') {
      scopedArgs.data = this.applyTenantIdToData(scopedArgs.data, tenantId, model, action);
      return scopedArgs;
    }

    if (action === 'upsert') {
      scopedArgs.where = this.applyScopedUniqueWhere(scopedArgs.where, tenantContext, model, action);
      scopedArgs.create = this.applyTenantIdToData(scopedArgs.create, tenantId, model, action);
      scopedArgs.update = this.applyTenantIdToData(scopedArgs.update, tenantId, model, action);
      return scopedArgs;
    }

    if (action === 'update' || action === 'delete') {
      scopedArgs.where = this.applyScopedUniqueWhere(scopedArgs.where, tenantContext, model, action);
    }

    if (action === 'updateMany' || action === 'deleteMany') {
      scopedArgs.where = this.applyScopedWhere(scopedArgs.where, tenantContext, model, action);
    }

    if (scopedArgs.data !== undefined) {
      scopedArgs.data = this.applyTenantIdToData(scopedArgs.data, tenantId, model, action);
    }

    return scopedArgs;
  }

  private applyScopedWhere(
    where: Record<string, any> | undefined,
    tenantContext: TenantContext,
    model: string,
    action: PrismaAction
  ) {
    const tenantId = tenantContext.tenantId as string;
    const provided = this.extractTenantId(where);

    if (provided && provided !== tenantId) {
      const message = `Cross-tenant where detected for ${model}.${action}; expected ${tenantId}, received ${provided}`;
      if (this.enforcementMode === 'strict') {
        throw new Error(message);
      }
      this.logger.warn(message);
    }

    return {
      ...(where ?? {}),
      tenantId
    };
  }

  private applyScopedUniqueWhere(
    args: Record<string, any> | undefined,
    tenantContext: TenantContext,
    model: string,
    action: PrismaAction
  ) {
    const tenantId = tenantContext.tenantId as string;
    const scopedArgs = args ? { ...args } : {};
    const provided = this.extractTenantId(scopedArgs.where);

    if (provided && provided !== tenantId) {
      const message = `Cross-tenant unique where detected for ${model}.${action}; expected ${tenantId}, received ${provided}`;
      if (this.enforcementMode === 'strict') {
        throw new Error(message);
      }
      this.logger.warn(message);
    }

    if (!provided) {
      const message = `Missing tenant qualifier in unique where for ${model}.${action}; cannot auto-inject for unique operations`;
      if (this.enforcementMode === 'strict') {
        throw new Error(message);
      }
      this.logger.warn(message);
    }

    return scopedArgs;
  }

  private applyTenantIdToData(
    data: Record<string, any> | null | undefined,
    tenantId: string,
    model: string,
    action: PrismaAction
  ) {
    if (data === undefined || data === null) {
      throw new Error(
        `Cannot apply tenantId: data payload is missing for tenant-scoped write on ${model}.${action}`
      );
    }

    if (Array.isArray(data)) {
      return data.map((row) => ({ ...row, tenantId }));
    }

    return {
      ...data,
      tenantId
    };
  }

  private extractTenantId(where?: Record<string, any>): string | undefined {
    if (!where || typeof where !== 'object') {
      return undefined;
    }

    const rawTenantId = (where as Record<string, any>).tenantId;
    if (!rawTenantId) {
      const compositeKey = Object.keys(where).find((key) => key.toLowerCase().includes('tenantid'));
      if (compositeKey) {
        const composite = (where as Record<string, any>)[compositeKey];
        if (composite && typeof composite === 'object') {
          if (typeof composite.tenantId === 'string') {
            return composite.tenantId;
          }
          if (composite.tenantId && typeof composite.tenantId.equals === 'string') {
            return composite.tenantId.equals;
          }
        }
      }
      return undefined;
    }

    if (typeof rawTenantId === 'string') {
      return rawTenantId;
    }

    if (typeof rawTenantId === 'object' && typeof rawTenantId.equals === 'string') {
      return rawTenantId.equals;
    }

    return undefined;
  }

  private logHubAccess(params: Prisma.MiddlewareParams, tenantContext: TenantContext) {
    const whereTenant = this.extractTenantId(params.args?.where);
    if (!whereTenant) {
      this.logger.debug(
        `Hub context query without explicit tenantId on ${params.model}.${params.action}`,
        tenantContext as Record<string, unknown>
      );
    }
  }
}
