"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TENANT_SCOPED_MODELS = void 0;
// Modelos que recebem tenantId automaticamente via PrismaService.
// Mantenha esta lista sincronizada com docs/tenancy.md para garantir consistência.
exports.TENANT_SCOPED_MODELS = [
    'TenantMembership',
    'TenantPlugin',
    'AuditLog'
];
//# sourceMappingURL=tenant-scoped-models.js.map