import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TenantContext, extractTenantSlugFromHost, isHubHost } from '@aza8/core-domain';

import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class TenancyService {
  constructor(private readonly prisma: PrismaService) {}

  async resolveContext(hostHeader?: string | null, tenantSlugOverride?: string | null): Promise<TenantContext> {
    if (!hostHeader) {
      throw new BadRequestException('Host header missing');
    }

    const host = hostHeader.split(':')[0];
    const normalizedOverride = tenantSlugOverride?.trim() || null;

    // Hub host or plain localhost -> hub unless override provided
    if (this.isInternalHost(host) || isHubHost(host)) {
      if (!normalizedOverride) {
        return {
          tenantId: null,
          tenantSlug: null,
          isHubRequest: true
        };
      }
      const tenant = await this.findTenantBySlug(normalizedOverride);
      return {
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        isHubRequest: false
      };
    }

    const tenantSlug = extractTenantSlugFromHost(host);
    if (!tenantSlug) {
      throw new NotFoundException('Tenant not found');
    }

    const tenant = await this.findTenantBySlug(tenantSlug);

    return {
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      isHubRequest: false
    };
  }

  private isInternalHost(host: string) {
    return host === 'localhost' || host === '127.0.0.1' || host === 'hub.localhost';
  }

  private async findTenantBySlug(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug },
      select: { id: true, slug: true }
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }
    return tenant;
  }
}
