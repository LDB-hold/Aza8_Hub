import { Injectable } from '@nestjs/common';
import { BaseRole, RoleScope } from '@aza8/core-domain';

import { PrismaService } from '../database/prisma.service.js';

@Injectable()
export class RbacService {
  constructor(private readonly prisma: PrismaService) {}

  async ensureRole(key: BaseRole, scope: RoleScope) {
    const existing = await this.prisma.role.findFirst({ where: { key, scope } });
    if (existing) {
      return existing;
    }

    return this.prisma.role.create({
      data: {
        key,
        scope,
        name: key.replaceAll('_', ' '),
        description: `${key} role for ${scope}`
      }
    });
  }
}
