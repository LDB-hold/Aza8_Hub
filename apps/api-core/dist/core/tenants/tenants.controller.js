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
exports.TenantsController = void 0;
const common_1 = require("@nestjs/common");
const auth_guard_js_1 = require("../../auth/auth.guard.js");
const rbac_guard_js_1 = require("../../rbac/rbac.guard.js");
const rbac_decorator_js_1 = require("../../rbac/rbac.decorator.js");
const tenants_service_js_1 = require("./tenants.service.js");
const class_validator_1 = require("class-validator");
class CreateTenantDto {
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CreateTenantDto.prototype, "slug", void 0);
let TenantsController = class TenantsController {
    constructor(tenantsService) {
        this.tenantsService = tenantsService;
    }
    current() {
        return this.tenantsService.getCurrentTenant();
    }
    list() {
        return this.tenantsService.listTenants();
    }
    create(dto) {
        return this.tenantsService.createTenant(dto);
    }
};
exports.TenantsController = TenantsController;
__decorate([
    (0, common_1.Get)('current'),
    (0, common_1.UseGuards)(auth_guard_js_1.AuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "current", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(auth_guard_js_1.AuthGuard, rbac_guard_js_1.PermissionsGuard),
    (0, rbac_decorator_js_1.RequirePermissions)('HUB_TENANT_READ'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(auth_guard_js_1.AuthGuard, rbac_guard_js_1.PermissionsGuard),
    (0, rbac_decorator_js_1.RequirePermissions)('HUB_TENANT_WRITE'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTenantDto]),
    __metadata("design:returntype", void 0)
], TenantsController.prototype, "create", null);
exports.TenantsController = TenantsController = __decorate([
    (0, common_1.Controller)('hub/tenants'),
    __metadata("design:paramtypes", [tenants_service_js_1.TenantsService])
], TenantsController);
//# sourceMappingURL=tenants.controller.js.map