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
        createdAt: true
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
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async createTenant(input: { name: string; slug: string }) {
    const context = this.tenantContext.getContext();
    if (!context.isHubRequest) {
      throw new BadRequestException('Only hub requests may create tenants');
    }

    return this.prisma.tenant.create({
      data: {
        id: `tenant_${input.slug}`,
        name: input.name,
        slug: input.slug
      }
    });
  }
}
