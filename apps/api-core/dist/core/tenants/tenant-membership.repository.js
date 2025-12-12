"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantMembershipRepository = void 0;
const common_1 = require("@nestjs/common");
const tenant_scoped_repository_js_1 = require("../../common/tenant-scoped.repository.js");
const prisma_service_js_1 = require("../../database/prisma.service.js");
const tenant_context_service_js_1 = require("../../tenancy/tenant-context.service.js");
let TenantMembershipRepository = class TenantMembershipRepository extends tenant_scoped_repository_js_1.AbstractTenantScopedRepository {
    constructor(prisma, tenantContextService) {
        super(prisma, tenantContextService, prisma.tenantMembership);
    }
    async listMembers(args) {
        return this.model.findMany({
            ...(args ?? {}),
            where: this.scopeWhere(args?.where)
        });
    }
    async addMember(data) {
        return this.model.create({
            data: this.scopeCreate(data)
        });
    }
    async updateMemberRole(id, roleId) {
        return this.model.updateMany({
            where: this.scopeWhere({ id }),
            data: { roleId }
        });
    }
    async removeMember(id) {
        return this.model.deleteMany({
            where: this.scopeWhere({ id })
        });
    }
};
exports.TenantMembershipRepository = TenantMembershipRepository;
exports.TenantMembershipRepository = TenantMembershipRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        tenant_context_service_js_1.TenantContextService])
], TenantMembershipRepository);
//# sourceMappingURL=tenant-membership.repository.js.map