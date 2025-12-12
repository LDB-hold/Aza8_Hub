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
exports.HubToolsController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const prisma_service_js_1 = require("../database/prisma.service.js");
const auth_guard_js_1 = require("../auth/auth.guard.js");
const rbac_guard_js_1 = require("../rbac/rbac.guard.js");
const rbac_decorator_js_1 = require("../rbac/rbac.decorator.js");
class ToolToggleDto {
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ToolToggleDto.prototype, "enabled", void 0);
let HubToolsController = class HubToolsController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list(tenantId) {
        return this.prisma.toolInstall.findMany({
            where: { tenantId },
            include: { tool: true }
        });
    }
    async toggle(tenantId, toolKey, dto) {
        return this.prisma.toolInstall.upsert({
            where: { tenantId_toolKey: { tenantId, toolKey } },
            update: { enabled: dto.enabled },
            create: {
                id: `ti_${tenantId}_${toolKey}`,
                tenantId,
                toolKey,
                enabled: dto.enabled
            }
        });
    }
};
exports.HubToolsController = HubToolsController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(rbac_guard_js_1.PermissionsGuard),
    (0, rbac_decorator_js_1.RequirePermissions)('HUB_TOOLS_MANAGE'),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HubToolsController.prototype, "list", null);
__decorate([
    (0, common_1.Put)(':toolKey'),
    (0, common_1.UseGuards)(rbac_guard_js_1.PermissionsGuard),
    (0, rbac_decorator_js_1.RequirePermissions)('HUB_TOOLS_MANAGE'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Param)('toolKey')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, ToolToggleDto]),
    __metadata("design:returntype", Promise)
], HubToolsController.prototype, "toggle", null);
exports.HubToolsController = HubToolsController = __decorate([
    (0, common_1.Controller)('hub/tenants/:tenantId/tools'),
    (0, common_1.UseGuards)(auth_guard_js_1.AuthGuard),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], HubToolsController);
//# sourceMappingURL=tools.controller.js.map