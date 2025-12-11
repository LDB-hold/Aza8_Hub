import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantContext, extractTenantSlugFromHost, isHubHost } from '@aza8/core-domain';

import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class TenancyService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveContext(hostHeader?: string | null): Promise<TenantContext> {
    if (!hostHeader) {
      throw new BadRequestException('Host header missing');
    }

    const host = hostHeader.split(':')[0];

    if (this.isInternalHost(host) || isHubHost(host)) {
      return {
        tenantId: null,
        tenantSlug: null,
        isHubRequest: true
      };
    }

    const tenantSlug = extractTenantSlugFromHost(host);
    if (!tenantSlug) {
      throw new NotFoundException('Tenant not found');
    }

    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      select: { id: true, slug: true }
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    return {
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      isHubRequest: false
    };
  }

  private isInternalHost(host: string) {
    return host === 'localhost' || host === '127.0.0.1';
  }
}
