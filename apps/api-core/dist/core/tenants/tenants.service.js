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
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../../database/prisma.service.js");
const tenant_context_service_js_1 = require("../../tenancy/tenant-context.service.js");
let TenantsService = class TenantsService {
    constructor(prisma, tenantContext) {
        this.prisma = prisma;
        this.tenantContext = tenantContext;
    }
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
            throw new common_1.NotFoundException('Tenant not found');
        }
        return { tenant, context };
    }
    async listTenants() {
        const context = this.tenantContext.getContext();
        if (!context.isHubRequest) {
            throw new common_1.BadRequestException('Only hub requests may list tenants');
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
    async createTenant(input) {
        const context = this.tenantContext.getContext();
        if (!context.isHubRequest) {
            throw new common_1.BadRequestException('Only hub requests may create tenants');
        }
        return this.prisma.tenant.create({
            data: {
                id: `tenant_${input.slug}`,
                name: input.name,
                slug: input.slug
            }
        });
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        tenant_context_service_js_1.TenantContextService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map