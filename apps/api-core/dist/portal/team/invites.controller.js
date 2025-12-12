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
exports.PortalInvitesController = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const class_validator_1 = require("class-validator");
const prisma_service_js_1 = require("../../database/prisma.service.js");
const auth_guard_js_1 = require("../../auth/auth.guard.js");
const rbac_guard_js_1 = require("../../rbac/rbac.guard.js");
const rbac_decorator_js_1 = require("../../rbac/rbac.decorator.js");
const tenant_context_service_js_1 = require("../../tenancy/tenant-context.service.js");
class InviteCreateDto {
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], InviteCreateDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], InviteCreateDto.prototype, "roleKey", void 0);
class InviteAcceptDto {
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], InviteAcceptDto.prototype, "email", void 0);
let PortalInvitesController = class PortalInvitesController {
    constructor(prisma, tenantContext) {
        this.prisma = prisma;
        this.tenantContext = tenantContext;
    }
    async list() {
        const context = this.tenantContext.getContext();
        return this.prisma.invite.findMany({
            where: { tenantId: context.tenantId ?? undefined },
            orderBy: { createdAt: 'desc' }
        });
    }
    async create(dto) {
        const context = this.tenantContext.getContext();
        return this.prisma.invite.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                tenantId: context.tenantId,
                email: dto.email,
                roleKey: dto.roleKey,
                token: (0, crypto_1.randomUUID)(),
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
            }
        });
    }
    async accept(token, dto) {
        const invite = await this.prisma.invite.findUnique({ where: { token } });
        if (!invite) {
            return { success: false, reason: 'invalid_token' };
        }
        await this.prisma.invite.update({
            where: { token },
            data: { acceptedAt: new Date() }
        });
        const user = await this.prisma.user.upsert({
            where: { email: dto.email },
            update: { name: dto.email.split('@')[0], type: 'PORTAL' },
            create: { id: `user_${token}`, email: dto.email, name: dto.email.split('@')[0], type: 'PORTAL' }
        });
        await this.prisma.membership.upsert({
            where: { tenantId_userId: { tenantId: invite.tenantId, userId: user.id } },
            update: { roleKey: invite.roleKey },
            create: { id: `m_${token}`, tenantId: invite.tenantId, userId: user.id, roleKey: invite.roleKey }
        });
        return { success: true };
    }
};
exports.PortalInvitesController = PortalInvitesController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_guard_js_1.AuthGuard, rbac_guard_js_1.PermissionsGuard),
    (0, rbac_decorator_js_1.RequirePermissions)('TENANT_MEMBER_INVITE'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PortalInvitesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_js_1.AuthGuard, rbac_guard_js_1.PermissionsGuard),
    (0, rbac_decorator_js_1.RequirePermissions)('TENANT_MEMBER_INVITE'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [InviteCreateDto]),
    __metadata("design:returntype", Promise)
], PortalInvitesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('accept/:token'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, InviteAcceptDto]),
    __metadata("design:returntype", Promise)
], PortalInvitesController.prototype, "accept", null);
exports.PortalInvitesController = PortalInvitesController = __decorate([
    (0, common_1.Controller)('portal/invites'),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        tenant_context_service_js_1.TenantContextService])
], PortalInvitesController);
//# sourceMappingURL=invites.controller.js.map