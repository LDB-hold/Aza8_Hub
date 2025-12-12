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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortalMembersController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const prisma_service_js_1 = require("../../database/prisma.service.js");
const auth_guard_js_1 = require("../../auth/auth.guard.js");
const rbac_guard_js_1 = require("../../rbac/rbac.guard.js");
const rbac_decorator_js_1 = require("../../rbac/rbac.decorator.js");
class UpdateRoleDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateRoleDto.prototype, "roleKey", void 0);
let PortalMembersController = class PortalMembersController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list() {
        const memberships = await this.prisma.membership.findMany({
            include: { user: true }
        });
        return memberships.map((m) => ({
            id: m.id,
            userId: m.userId,
            tenantId: m.tenantId,
            roleKey: m.roleKey,
            email: m.user.email,
            name: m.user.name
        }));
    }
    async updateRole(userId, dto) {
        await this.prisma.membership.updateMany({
            where: { userId },
            data: { roleKey: dto.roleKey }
        });
        return { success: true };
    }
};
exports.PortalMembersController = PortalMembersController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(rbac_guard_js_1.PermissionsGuard),
    (0, rbac_decorator_js_1.RequirePermissions)('TENANT_MEMBER_READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PortalMembersController.prototype, "list", null);
__decorate([
    (0, common_1.Patch)(':userId/role'),
    (0, common_1.UseGuards)(rbac_guard_js_1.PermissionsGuard),
    (0, rbac_decorator_js_1.RequirePermissions)('TENANT_MEMBER_ROLE_UPDATE'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateRoleDto]),
    __metadata("design:returntype", Promise)
], PortalMembersController.prototype, "updateRole", null);
exports.PortalMembersController = PortalMembersController = __decorate([
    (0, common_1.Controller)('portal/members'),
    (0, common_1.UseGuards)(auth_guard_js_1.AuthGuard),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], PortalMembersController);
//# sourceMappingURL=members.controller.js.map