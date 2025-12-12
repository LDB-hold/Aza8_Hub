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
exports.PortalRequestsController = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const class_validator_1 = require("class-validator");
const client_1 = require("@prisma/client");
const prisma_service_js_1 = require("../../database/prisma.service.js");
const auth_guard_js_1 = require("../../auth/auth.guard.js");
const rbac_guard_js_1 = require("../../rbac/rbac.guard.js");
const rbac_decorator_js_1 = require("../../rbac/rbac.decorator.js");
const tenant_context_service_js_1 = require("../../tenancy/tenant-context.service.js");
class RequestCreateDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], RequestCreateDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], RequestCreateDto.prototype, "description", void 0);
class RequestDecisionDto {
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RequestDecisionDto.prototype, "note", void 0);
let PortalRequestsController = class PortalRequestsController {
    constructor(prisma, tenantContext) {
        this.prisma = prisma;
        this.tenantContext = tenantContext;
    }
    async list() {
        const context = this.tenantContext.getContext();
        return this.prisma.requestItem.findMany({
            where: { tenantId: context.tenantId ?? undefined },
            orderBy: { createdAt: 'desc' }
        });
    }
    async create(dto, req) {
        const context = this.tenantContext.getContext();
        return this.prisma.requestItem.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                title: dto.title,
                description: dto.description,
                status: client_1.RequestStatus.OPEN,
                createdByUserId: req.userContext?.user.id ?? '',
                tenantId: context.tenantId
            }
        });
    }
    async approve(id, req, _dto) {
        const context = this.tenantContext.getContext();
        return this.prisma.requestItem.update({
            where: { id, tenantId: context.tenantId ?? undefined },
            data: {
                status: client_1.RequestStatus.APPROVED,
                decidedByUserId: req.userContext?.user.id ?? undefined
            }
        });
    }
    async reject(id, req, _dto) {
        const context = this.tenantContext.getContext();
        return this.prisma.requestItem.update({
            where: { id, tenantId: context.tenantId ?? undefined },
            data: {
                status: client_1.RequestStatus.REJECTED,
                decidedByUserId: req.userContext?.user.id ?? undefined
            }
        });
    }
};
exports.PortalRequestsController = PortalRequestsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(rbac_guard_js_1.PermissionsGuard),
    (0, rbac_decorator_js_1.RequirePermissions)('TOOL_REQUESTS_READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PortalRequestsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(rbac_guard_js_1.PermissionsGuard),
    (0, rbac_decorator_js_1.RequirePermissions)('TOOL_REQUESTS_CREATE'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RequestCreateDto, Object]),
    __metadata("design:returntype", Promise)
], PortalRequestsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/approve'),
    (0, common_1.UseGuards)(rbac_guard_js_1.PermissionsGuard),
    (0, rbac_decorator_js_1.RequirePermissions)('TOOL_REQUESTS_APPROVE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, RequestDecisionDto]),
    __metadata("design:returntype", Promise)
], PortalRequestsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(':id/reject'),
    (0, common_1.UseGuards)(rbac_guard_js_1.PermissionsGuard),
    (0, rbac_decorator_js_1.RequirePermissions)('TOOL_REQUESTS_APPROVE'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, RequestDecisionDto]),
    __metadata("design:returntype", Promise)
], PortalRequestsController.prototype, "reject", null);
exports.PortalRequestsController = PortalRequestsController = __decorate([
    (0, common_1.Controller)('portal/tools/requests'),
    (0, common_1.UseGuards)(auth_guard_js_1.AuthGuard),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        tenant_context_service_js_1.TenantContextService])
], PortalRequestsController);
//# sourceMappingURL=requests.controller.js.map