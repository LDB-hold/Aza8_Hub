import { Prisma } from '@prisma/client';
import { AbstractTenantScopedRepository } from '../../common/tenant-scoped.repository.js';
import { PrismaService } from '../../database/prisma.service.js';
import { TenantContextService } from '../../tenancy/tenant-context.service.js';
type MembershipDelegate = PrismaService['tenantMembership'];
export declare class TenantMembershipRepository extends AbstractTenantScopedRepository<MembershipDelegate, Prisma.TenantMembershipWhereInput, Prisma.TenantMembershipUncheckedCreateInput, Prisma.TenantMembershipUncheckedUpdateInput> {
    constructor(prisma: PrismaService, tenantContextService: TenantContextService);
    listMembers(args?: Omit<Prisma.TenantMembershipFindManyArgs, 'where'> & {
        where?: Omit<Prisma.TenantMembershipWhereInput, 'tenantId'>;
    }): Promise<{
        id: string;
        tenantId: string;
        userId: string;
        roleId: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    addMember(data: Omit<Prisma.TenantMembershipUncheckedCreateInput, 'tenantId'>): Promise<{
        id: string;
        tenantId: string;
        userId: string;
        roleId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMemberRole(id: string, roleId: string): Promise<Prisma.BatchPayload>;
    removeMember(id: string): Promise<Prisma.BatchPayload>;
}
export {};
