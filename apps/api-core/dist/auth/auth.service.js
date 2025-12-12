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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../database/prisma.service.js");
const tenant_context_service_js_1 = require("../tenancy/tenant-context.service.js");
const rbac_service_js_1 = require("../rbac/rbac.service.js");
const HUB_ROLE_BY_EMAIL = {
    'aza8_admin@aza8.com': 'AZA8_ADMIN',
    'aza8_support@aza8.com': 'AZA8_SUPPORT'
};
let AuthService = class AuthService {
    constructor(prisma, tenantContext, rbac) {
        this.prisma = prisma;
        this.tenantContext = tenantContext;
        this.rbac = rbac;
    }
    async login(payload) {
        const tenantContext = this.tenantContext.getContext();
        return this.buildUserContextByEmail(payload.email, tenantContext);
    }
    async buildUserContextByEmail(email, tenantContext = this.tenantContext.getContext()) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return this.buildUserContext(user.id, tenantContext);
    }
    async buildUserContext(userId, tenantContext = this.tenantContext.getContext()) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        if (tenantContext.isHubRequest) {
            if (user.type !== 'HUB') {
                throw new common_1.UnauthorizedException('Hub access denied');
            }
            const role = HUB_ROLE_BY_EMAIL[user.email] ?? 'AZA8_SUPPORT';
            const permissions = this.rbac.getPermissionsForRole(role);
            return {
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    type: user.type,
                    createdAt: user.createdAt
                },
                membership: null,
                tenantContext,
                role,
                permissions
            };
        }
        if (!tenantContext.tenantId) {
            throw new common_1.UnauthorizedException('Tenant missing');
        }
        if (user.type !== 'PORTAL') {
            throw new common_1.UnauthorizedException('Portal access denied');
        }
        const membership = await this.prisma.membership.findUnique({
            where: { tenantId_userId: { tenantId: tenantContext.tenantId, userId: user.id } }
        });
        if (!membership) {
            throw new common_1.UnauthorizedException('Membership not found for tenant');
        }
        const role = membership.roleKey;
        const permissions = this.rbac.getPermissionsForRole(role);
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                type: user.type,
                createdAt: user.createdAt
            },
            membership: {
                id: membership.id,
                tenantId: membership.tenantId,
                userId: membership.userId,
                roleKey: membership.roleKey
            },
            tenantContext,
            role,
            permissions
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        tenant_context_service_js_1.TenantContextService,
        rbac_service_js_1.RbacService])
], AuthService);
//# sourceMappingURL=auth.service.js.map