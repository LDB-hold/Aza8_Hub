import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { AbstractTenantScopedRepository } from '../../common/tenant-scoped.repository.js';
import { PrismaService } from '../../database/prisma.service.js';
import { TenantContextService } from '../../tenancy/tenant-context.service.js';

type MembershipDelegate = PrismaService['tenantMembership'];

@Injectable()
export class TenantMembershipRepository extends AbstractTenantScopedRepository<
  MembershipDelegate,
  Prisma.TenantMembershipWhereInput,
  Prisma.TenantMembershipUncheckedCreateInput,
  Prisma.TenantMembershipUncheckedUpdateInput
> {
  constructor(
    prisma: PrismaService,
    tenantContextService: TenantContextService
  ) {
    super(prisma, tenantContextService, prisma.tenantMembership);
  }

  async listMembers(
    args?: Omit<Prisma.TenantMembershipFindManyArgs, 'where'> & {
      where?: Omit<Prisma.TenantMembershipWhereInput, 'tenantId'>;
    }
  ) {
    return this.model.findMany({
      ...(args ?? {}),
      where: this.scopeWhere(args?.where)
    });
  }

  async addMember(data: Omit<Prisma.TenantMembershipUncheckedCreateInput, 'tenantId'>) {
    return this.model.create({
      data: this.scopeCreate(data)
    });
  }

  async updateMemberRole(id: string, roleId: string) {
    return this.model.updateMany({
      where: this.scopeWhere({ id }),
      data: { roleId }
    });
  }

  async removeMember(id: string) {
    return this.model.deleteMany({
      where: this.scopeWhere({ id })
    });
  }
}
