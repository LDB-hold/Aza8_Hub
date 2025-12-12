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
exports.TenantPluginRepository = void 0;
const common_1 = require("@nestjs/common");
const tenant_scoped_repository_js_1 = require("../../common/tenant-scoped.repository.js");
const prisma_service_js_1 = require("../../database/prisma.service.js");
const tenant_context_service_js_1 = require("../../tenancy/tenant-context.service.js");
let TenantPluginRepository = class TenantPluginRepository extends tenant_scoped_repository_js_1.AbstractTenantScopedRepository {
    constructor(prisma, tenantContextService) {
        super(prisma, tenantContextService, prisma.tenantPlugin);
    }
    async listPlugins(args) {
        return this.model.findMany({
            ...(args ?? {}),
            where: this.scopeWhere(args?.where)
        });
    }
    async upsertPlugin(pluginId, data) {
        const tenantId = this.getTenantId();
        return this.model.upsert({
            where: {
                tenantId_pluginId: {
                    tenantId,
                    pluginId
                }
            },
            update: {
                status: data.status,
                config: data.config
            },
            create: {
                ...this.scopeCreate({
                    pluginId,
                    status: data.status,
                    config: data.config
                })
            }
        });
    }
    async setStatus(pluginId, status) {
        const tenantId = this.getTenantId();
        return this.model.update({
            where: {
                tenantId_pluginId: { tenantId, pluginId }
            },
            data: { status }
        });
    }
};
exports.TenantPluginRepository = TenantPluginRepository;
exports.TenantPluginRepository = TenantPluginRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        tenant_context_service_js_1.TenantContextService])
], TenantPluginRepository);
//# sourceMappingURL=tenant-plugin.repository.js.map