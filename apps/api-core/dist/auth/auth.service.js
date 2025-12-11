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
const jwt_1 = require("@nestjs/jwt");
const core_domain_1 = require("@aza8/core-domain");
const prisma_service_js_1 = require("../database/prisma.service.js");
const app_config_service_js_1 = require("../config/app-config.service.js");
const rbac_service_js_1 = require("../rbac/rbac.service.js");
let AuthService = class AuthService {
    constructor(prisma, jwtService, configService, rbacService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.rbacService = rbacService;
    }
    async handleCallback(payload) {
        const user = await this.prisma.user.upsert({
            where: { email: payload.email },
            create: {
                email: payload.email,
                name: payload.name,
                status: 'ACTIVE',
                authProvider: payload.provider,
                authProviderId: payload.providerId
            },
            update: {
                name: payload.name,
                authProvider: payload.provider,
                authProviderId: payload.providerId
            }
        });
        if (payload.tenantSlug) {
            const tenant = await this.ensureTenant(payload.tenantSlug, payload.tenantName ?? payload.tenantSlug);
            const role = await this.rbacService.ensureRole(core_domain_1.BaseRole.TENANT_OWNER, core_domain_1.RoleScope.TENANT);
            await this.ensureMembership(user.id, tenant.id, role.id);
        }
        else {
            const tenant = await this.ensureHubTenant();
            const role = await this.rbacService.ensureRole(core_domain_1.BaseRole.AZA8_OPERATOR, core_domain_1.RoleScope.GLOBAL_AZA8);
            await this.ensureMembership(user.id, tenant.id, role.id);
        }
        const token = await this.issueToken(user.id);
        return { token };
    }
    async validateToken(token, tenantContext) {
        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.apiConfig.authSecret
            });
            const user = await this.prisma.user.findUnique({
                where: { id: payload.sub },
                include: {
                    memberships: {
                        include: { role: true }
                    }
                }
            });
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            const filteredMemberships = this.filterMemberships(user.memberships, tenantContext);
            const memberships = this.normalizeMemberships(filteredMemberships);
            const roles = memberships.map((membership) => membership.role.key);
            return {
                user: this.toDomainUser(user),
                memberships,
                tenantContext,
                roles
            };
        }
        catch (error) {
            throw new common_1.UnauthorizedException('Invalid token');
        }
    }
    async issueToken(userId) {
        return this.jwtService.signAsync({ sub: userId }, {
            secret: this.configService.apiConfig.authSecret,
            expiresIn: '7d'
        });
    }
    async ensureTenant(slug, name) {
        return this.prisma.tenant.upsert({
            where: { slug },
            update: { name },
            create: {
                slug,
                name,
                status: 'ACTIVE',
                plan: 'STANDARD',
                config: {}
            }
        });
    }
    async ensureHubTenant() {
        return this.ensureTenant('aza8', 'Aza8 HQ');
    }
    async ensureMembership(userId, tenantId, roleId) {
        await this.prisma.tenantMembership.upsert({
            where: {
                tenantId_userId_roleId: {
                    tenantId,
                    userId,
                    roleId
                }
            },
            update: {},
            create: {
                tenantId,
                userId,
                roleId
            }
        });
    }
    filterMemberships(memberships, tenantContext) {
        if (tenantContext.isHubRequest) {
            return memberships.filter((membership) => membership.role.scope === core_domain_1.RoleScope.GLOBAL_AZA8);
        }
        if (!tenantContext.tenantId) {
            return [];
        }
        return memberships.filter((membership) => membership.tenantId === tenantContext.tenantId);
    }
    normalizeMemberships(memberships) {
        return memberships.map((membership) => ({
            ...membership,
            role: {
                ...membership.role,
                scope: membership.role.scope,
                key: membership.role.key,
                description: membership.role.description ?? undefined
            }
        }));
    }
    toDomainUser(user) {
        return {
            id: user.id,
            email: user.email,
            name: user.name,
            status: user.status,
            authProvider: user.authProvider,
            authProviderId: user.authProviderId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        jwt_1.JwtService,
        app_config_service_js_1.AppConfigService,
        rbac_service_js_1.RbacService])
], AuthService);
//# sourceMappingURL=auth.service.js.map