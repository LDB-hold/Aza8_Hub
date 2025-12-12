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
exports.RbacGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const tenant_context_service_js_1 = require("../tenancy/tenant-context.service.js");
const rbac_decorator_js_1 = require("./rbac.decorator.js");
let RbacGuard = class RbacGuard {
    constructor(reflector, tenantContextService) {
        this.reflector = reflector;
        this.tenantContextService = tenantContextService;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(rbac_decorator_js_1.REQUIRE_ROLES_METADATA_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        const requiredPermissions = this.reflector.getAllAndOverride(rbac_decorator_js_1.REQUIRE_PERMISSIONS_METADATA_KEY, [context.getHandler(), context.getClass()]);
        if ((!requiredRoles || requiredRoles.length === 0) && (!requiredPermissions || requiredPermissions.length === 0)) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const userContext = request.userContext;
        if (!userContext ||
            !Array.isArray(userContext.roles) ||
            !Array.isArray(userContext.permissions) ||
            !userContext.tenantContext) {
            throw new common_1.UnauthorizedException();
        }
        const tenantContext = this.tenantContextService.getContext();
        if (userContext.tenantContext.isHubRequest !== tenantContext.isHubRequest ||
            (!tenantContext.isHubRequest && userContext.tenantContext.tenantId !== tenantContext.tenantId)) {
            throw new common_1.UnauthorizedException();
        }
        const hasRoles = !requiredRoles || requiredRoles.length === 0 || requiredRoles.some((role) => userContext.roles.includes(role));
        const hasPermissions = !requiredPermissions ||
            requiredPermissions.length === 0 ||
            requiredPermissions.every((permission) => userContext.permissions.includes(permission));
        return hasRoles && hasPermissions;
    }
};
exports.RbacGuard = RbacGuard;
exports.RbacGuard = RbacGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        tenant_context_service_js_1.TenantContextService])
], RbacGuard);
//# sourceMappingURL=rbac.guard.js.map