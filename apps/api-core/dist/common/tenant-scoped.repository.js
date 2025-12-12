"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractTenantScopedRepository = void 0;
class AbstractTenantScopedRepository {
    // TODO: Document in docs/development.md that tenant-facing services should depend on these repositories instead of PrismaService directly.
    constructor(prisma, tenantContextService, model) {
        this.prisma = prisma;
        this.tenantContextService = tenantContextService;
        this.model = model;
    }
    getTenantId() {
        const context = this.tenantContextService.getContext();
        if (!context.tenantId) {
            throw new Error('Tenant context is required for tenant-scoped repositories');
        }
        return context.tenantId;
    }
    scopeWhere(where) {
        return {
            ...where,
            tenantId: this.getTenantId()
        };
    }
    scopeCreate(data) {
        return {
            ...data,
            tenantId: this.getTenantId()
        };
    }
    scopeUpdate(data) {
        return {
            ...data,
            tenantId: this.getTenantId()
        };
    }
}
exports.AbstractTenantScopedRepository = AbstractTenantScopedRepository;
//# sourceMappingURL=tenant-scoped.repository.js.map