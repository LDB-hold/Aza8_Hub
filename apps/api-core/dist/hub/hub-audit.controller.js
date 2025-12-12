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
exports.HubAuditController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_js_1 = require("../database/prisma.service.js");
const auth_guard_js_1 = require("../auth/auth.guard.js");
const rbac_guard_js_1 = require("../rbac/rbac.guard.js");
const rbac_decorator_js_1 = require("../rbac/rbac.decorator.js");
let HubAuditController = class HubAuditController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async list() {
        return this.prisma.auditLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 50
        });
    }
};
exports.HubAuditController = HubAuditController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(rbac_guard_js_1.PermissionsGuard),
    (0, rbac_decorator_js_1.RequirePermissions)('HUB_AUDIT_READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HubAuditController.prototype, "list", null);
exports.HubAuditController = HubAuditController = __decorate([
    (0, common_1.Controller)('hub/audit'),
    (0, common_1.UseGuards)(auth_guard_js_1.AuthGuard),
    __metadata("design:paramtypes", [prisma_service_js_1.PrismaService])
], HubAuditController);
//# sourceMappingURL=hub-audit.controller.js.map