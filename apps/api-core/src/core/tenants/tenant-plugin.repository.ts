import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { AbstractTenantScopedRepository } from '../../common/tenant-scoped.repository.js';
import { PrismaService } from '../../database/prisma.service.js';
import { TenantContextService } from '../../tenancy/tenant-context.service.js';

type TenantPluginDelegate = PrismaService['tenantPlugin'];

@Injectable()
export class TenantPluginRepository extends AbstractTenantScopedRepository<
  TenantPluginDelegate,
  Prisma.TenantPluginWhereInput,
  Prisma.TenantPluginUncheckedCreateInput,
  Prisma.TenantPluginUncheckedUpdateInput
> {
  constructor(
    prisma: PrismaService,
    tenantContextService: TenantContextService
  ) {
    super(prisma, tenantContextService, prisma.tenantPlugin);
  }

  async listPlugins(
    args?: Omit<Prisma.TenantPluginFindManyArgs, 'where'> & {
      where?: Omit<Prisma.TenantPluginWhereInput, 'tenantId'>;
    }
  ) {
    return this.model.findMany({
      ...(args ?? {}),
      where: this.scopeWhere(args?.where)
    });
  }

  async upsertPlugin(pluginId: string, data: { status: string; config: Prisma.InputJsonValue }) {
    const tenantId = this.getTenantId();
    return this.model.upsert({
      where: {
        tenantId_pluginId: {
          tenantId,
          pluginId
        }
      },
      update: {
        status: data.status,
        config: data.config
      },
      create: {
        ...this.scopeCreate({
          pluginId,
          status: data.status,
          config: data.config
        })
      }
    });
  }

  async setStatus(pluginId: string, status: string) {
    const tenantId = this.getTenantId();
    return this.model.update({
      where: {
        tenantId_pluginId: { tenantId, pluginId }
      },
      data: { status }
    });
  }
}
