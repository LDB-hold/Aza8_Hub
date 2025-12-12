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
exports.TenancyService = void 0;
const common_1 = require("@nestjs/common");
const core_domain_1 = require("@aza8/core-domain");
const prisma_service_js_1 = require("../database/prisma.service.js");
let TenancyService = class TenancyService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async resolveContext(hostHeader, tenantSlugOverride) {
        if (!hostHeader) {
            throw new common_1.BadRequestException('Host header missing');
        }
        const host = hostHeader.split(':')[0];
        const normalizedOverride = tenantSlugOverride?.trim() || null;
        // Hub host or plain localhost -> hub unless override provided
        if (this.isInternalHost(host) || (0, core_domain_1.isHubHost)(host)) {
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
        const tenantSlug = (0, core_domain_1.extractTenantSlugFromHost)(host);
        if (!tenantSlug) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const tenant = await this.findTenantBySlug(tenantSlug);
        return {
            tenantId: tenant.id,
            tenantSlug: tenant.slug,
            isHubRequest: false
        };
    }
    isInternalHost(host) {
        return host === 'localhost' || host === '127.0.0.1' || host === 'hub.localhost';
    }
    async findTenantBySlug(slug) {
        const tenant = await this.prisma.tenant.findUnique({
            where: { slug },
            select: { id: true, slug: true }
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        return tenant;
    }
};
exports.TenancyService = TenancyService;
exports.TenancyService = TenancyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], TenancyService);
//# sourceMappingURL=tenancy.service.js.map