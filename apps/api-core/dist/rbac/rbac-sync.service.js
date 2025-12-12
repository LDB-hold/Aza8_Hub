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
var RbacSyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacSyncService = void 0;
const common_1 = require("@nestjs/common");
const core_domain_1 = require("@aza8/core-domain");
const prisma_service_js_1 = require("../database/prisma.service.js");
let RbacSyncService = RbacSyncService_1 = class RbacSyncService {
    constructor(prisma) {
        this.prisma = prisma;
        this.logger = new common_1.Logger(RbacSyncService_1.name);
    }
    async syncBaseDefinitions() {
        await this.syncRoles();
        await this.syncPermissions();
        await this.syncRolePermissions();
    }
    async syncRoles() {
        for (const role of core_domain_1.BASE_ROLES) {
            const existing = await this.prisma.role.findFirst({ where: { key: role.code } });
            if (!existing) {
                await this.prisma.role.create({
                    data: {
                        key: role.code,
                        scope: role.scope,
                        name: this.formatRoleName(role),
                        description: role.description
                    }
                });
                continue;
            }
            if (existing.scope !== role.scope || existing.description !== role.description || existing.name !== this.formatRoleName(role)) {
                await this.prisma.role.update({
                    where: { id: existing.id },
                    data: {
                        scope: role.scope,
                        description: role.description,
                        name: this.formatRoleName(role)
                    }
                });
            }
        }
    }
    async syncPermissions() {
        for (const permission of core_domain_1.BASE_PERMISSIONS) {
            const existing = await this.prisma.permission.findUnique({ where: { key: permission.code } });
            if (!existing) {
                await this.prisma.permission.create({
                    data: {
                        key: permission.code,
                        description: permission.description
                    }
                });
                continue;
            }
            if (existing.description !== permission.description) {
                await this.prisma.permission.update({
                    where: { id: existing.id },
                    data: { description: permission.description }
                });
            }
        }
    }
    async syncRolePermissions() {
        const roles = await this.prisma.role.findMany({ where: { key: { in: core_domain_1.BASE_ROLES.map((role) => role.code) } } });
        const permissions = await this.prisma.permission.findMany({ where: { key: { in: core_domain_1.BASE_PERMISSIONS.map((permission) => permission.code) } } });
        const roleByCode = new Map();
        for (const role of roles) {
            roleByCode.set(role.key, role);
        }
        const permissionByCode = new Map();
        for (const permission of permissions) {
            permissionByCode.set(permission.key, permission);
        }
        for (const matrix of core_domain_1.ROLE_PERMISSION_MATRIX) {
            const role = roleByCode.get(matrix.roleCode);
            if (!role) {
                this.logger.warn(`Role ${matrix.roleCode} not found while syncing permissions`);
                continue;
            }
            const desiredPermissionIds = matrix.permissionCodes
                .map((code) => {
                const permission = permissionByCode.get(code);
                if (!permission) {
                    this.logger.warn(`Permission ${code} missing for role ${matrix.roleCode}`);
                }
                return permission?.id;
            })
                .filter((id) => Boolean(id));
            const existingRolePermissions = await this.prisma.rolePermission.findMany({
                where: { roleId: role.id }
            });
            const existingPermissionIds = new Set(existingRolePermissions.map((rp) => rp.permissionId));
            const desiredPermissionIdSet = new Set(desiredPermissionIds);
            for (const permissionId of desiredPermissionIds) {
                if (!existingPermissionIds.has(permissionId)) {
                    await this.prisma.rolePermission.create({
                        data: {
                            roleId: role.id,
                            permissionId
                        }
                    });
                }
            }
            for (const rolePermission of existingRolePermissions) {
                if (!desiredPermissionIdSet.has(rolePermission.permissionId)) {
                    await this.prisma.rolePermission.delete({ where: { id: rolePermission.id } });
                }
            }
        }
    }
    formatRoleName(role) {
        return role.code.replaceAll('_', ' ');
    }
};
exports.RbacSyncService = RbacSyncService;
exports.RbacSyncService = RbacSyncService = RbacSyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], RbacSyncService);
//# sourceMappingURL=rbac-sync.service.js.map