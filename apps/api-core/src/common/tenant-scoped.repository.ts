import { PrismaService } from '../database/prisma.service.js';
import { TenantContextService } from '../tenancy/tenant-context.service.js';

export abstract class AbstractTenantScopedRepository<
  TDelegate,
  TWhereInput extends { tenantId?: unknown },
  TCreateInput extends { tenantId?: unknown },
  TUpdateInput extends { tenantId?: unknown }
> {
  // TODO: Document in docs/development.md that tenant-facing services should depend on these repositories instead of PrismaService directly.
  protected constructor(
    protected readonly prisma: PrismaService,
    protected readonly tenantContextService: TenantContextService,
    protected readonly model: TDelegate
  ) {}

  protected getTenantId(): string {
    const context = this.tenantContextService.getContext();
    if (!context.tenantId) {
      throw new Error('Tenant context is required for tenant-scoped repositories');
    }

    return context.tenantId;
  }

  protected scopeWhere(where?: Omit<TWhereInput, 'tenantId'>): TWhereInput {
    return {
      ...(where as Record<string, unknown>),
      tenantId: this.getTenantId()
    } as TWhereInput;
  }

  protected scopeCreate(data: Omit<TCreateInput, 'tenantId'>): TCreateInput {
    return {
      ...(data as Record<string, unknown>),
      tenantId: this.getTenantId()
    } as TCreateInput;
  }

  protected scopeUpdate(data: Omit<TUpdateInput, 'tenantId'>): TUpdateInput {
    return {
      ...(data as Record<string, unknown>),
      tenantId: this.getTenantId()
    } as TUpdateInput;
  }
}
