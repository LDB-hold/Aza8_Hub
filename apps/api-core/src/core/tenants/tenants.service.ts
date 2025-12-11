import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../database/prisma.service.js';
import { TenantContextService } from '../../tenancy/tenant-context.service.js';

@Injectable()
export class TenantsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tenantContext: TenantContextService
  ) {}

  async getCurrentTenant() {
    const context = this.tenantContext.getContext();
    if (!context.tenantId) {
      return { tenant: null, context };
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: { id: context.tenantId },
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        plan: true
      }
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return { tenant, context };
  }

  async listTenants() {
    const context = this.tenantContext.getContext();
    if (!context.isHubRequest) {
      throw new BadRequestException('Only hub requests may list tenants');
    }

    return this.prisma.tenant.findMany({
      select: {
        id: true,
        slug: true,
        name: true,
        status: true,
        plan: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}
