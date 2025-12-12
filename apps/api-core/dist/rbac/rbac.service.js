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
exports.RbacService = void 0;
const common_1 = require("@nestjs/common");
const core_domain_1 = require("@aza8/core-domain");
const prisma_service_js_1 = require("../database/prisma.service.js");
const roleDefinitionsByCode = new Map(core_domain_1.BASE_ROLES.map((role) => [role.code, role]));
let RbacService = class RbacService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async ensureRole(key, scope) {
        const definition = roleDefinitionsByCode.get(key);
        if (!definition) {
            throw new Error(`Unknown role code: ${key}`);
        }
        if (definition.scope !== scope) {
            throw new Error(`Role ${key} is not allowed for scope ${scope}`);
        }
        const existing = await this.prisma.role.findFirst({ where: { key } });
        const formattedName = this.formatRoleName(definition.code);
        if (existing) {
            const requiresUpdate = existing.scope !== definition.scope ||
                existing.name !== formattedName ||
                existing.description !== definition.description;
            if (requiresUpdate) {
                await this.prisma.role.update({
                    where: { id: existing.id },
                    data: { scope: definition.scope, name: formattedName, description: definition.description }
                });
            }
            return existing;
        }
        return this.prisma.role.create({
            data: {
                key,
                scope: definition.scope,
                name: formattedName,
                description: definition.description
            }
        });
    }
    async getEffectiveAccessForUser(userId, tenantContext) {
        const memberships = await this.resolveMemberships(userId, tenantContext);
        const roles = memberships.map((membership) => membership.role.key);
        const permissions = this.collectPermissions(memberships, tenantContext);
        return { memberships, roles, permissions };
    }
    async resolveMemberships(userId, tenantContext) {
        if (!tenantContext.isHubRequest && !tenantContext.tenantId) {
            return [];
        }
        const memberships = await this.prisma.tenantMembership.findMany({
            where: {
                userId,
                ...(tenantContext.isHubRequest
                    ? { role: { scope: core_domain_1.RoleScope.GLOBAL_AZA8 } }
                    : { tenantId: tenantContext.tenantId ?? undefined, role: { scope: core_domain_1.RoleScope.TENANT } })
            },
            include: {
                role: {
                    include: {
                        permissions: {
                            include: {
                                permission: true
                            }
                        }
                    }
                }
            }
        });
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
    collectPermissions(memberships, tenantContext) {
        const scope = tenantContext.isHubRequest ? core_domain_1.RoleScope.GLOBAL_AZA8 : core_domain_1.RoleScope.TENANT;
        const permissionCodes = memberships.flatMap((membership) => (membership.role.permissions ?? []).map((rp) => rp.permission.key));
        const uniqueCodes = Array.from(new Set(permissionCodes));
        return uniqueCodes.filter((code) => {
            const permissionDefinition = core_domain_1.BASE_PERMISSIONS.find((permission) => permission.code === code);
            return permissionDefinition?.scope === scope;
        });
    }
    formatRoleName(code) {
        return code.replaceAll('_', ' ');
    }
};
exports.RbacService = RbacService;
exports.RbacService = RbacService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], RbacService);
//# sourceMappingURL=rbac.service.js.map