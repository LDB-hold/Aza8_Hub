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
exports.PortalFilesController = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const class_validator_1 = require("class-validator");
const prisma_service_js_1 = require("../../database/prisma.service.js");
const auth_guard_js_1 = require("../../auth/auth.guard.js");
const rbac_guard_js_1 = require("../../rbac/rbac.guard.js");
const rbac_decorator_js_1 = require("../../rbac/rbac.decorator.js");
const tenant_context_service_js_1 = require("../../tenancy/tenant-context.service.js");
class FileCreateDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], FileCreateDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], FileCreateDto.prototype, "contentText", void 0);
let PortalFilesController = class PortalFilesController {
    constructor(prisma, tenantContext) {
        this.prisma = prisma;
        this.tenantContext = tenantContext;
    }
    async list() {
        const context = this.tenantContext.getContext();
        return this.prisma.fileItem.findMany({
            where: { tenantId: context.tenantId ?? undefined },
            orderBy: { createdAt: 'desc' }
        });
    }
    async create(dto) {
        const context = this.tenantContext.getContext();
        return this.prisma.fileItem.create({
            data: {
                id: (0, crypto_1.randomUUID)(),
                tenantId: context.tenantId,
                name: dto.name,
                contentText: dto.contentText
            }
        });
    }
    async download(id, res) {
        const context = this.tenantContext.getContext();
        const file = await this.prisma.fileItem.findUnique({ where: { id, tenantId: context.tenantId ?? undefined } });
        if (!file) {
            res.status(404).send('Not found');
            return;
        }
        res.setHeader('Content-Type', 'text/plain');
        res.send(file.contentText);
    }
};
exports.PortalFilesController = PortalFilesController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(rbac_guard_js_1.PermissionsGuard),
    (0, rbac_decorator_js_1.RequirePermissions)('TOOL_FILES_READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PortalFilesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(rbac_guard_js_1.PermissionsGuard),
    (0, rbac_decorator_js_1.RequirePermissions)('TOOL_FILES_WRITE'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FileCreateDto]),
    __metadata("design:returntype", Promise)
], PortalFilesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id/download'),
    (0, common_1.UseGuards)(rbac_guard_js_1.PermissionsGuard),
    (0, rbac_decorator_js_1.RequirePermissions)('TOOL_FILES_READ'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PortalFilesController.prototype, "download", null);
exports.PortalFilesController = PortalFilesController = __decorate([
    (0, common_1.Controller)('portal/tools/files'),
    (0, common_1.UseGuards)(auth_guard_js_1.AuthGuard),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService,
        tenant_context_service_js_1.TenantContextService])
], PortalFilesController);
//# sourceMappingURL=files.controller.js.map