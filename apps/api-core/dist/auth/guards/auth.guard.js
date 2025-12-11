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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_js_1 = require("../../tenancy/tenant-context.service.js");
const auth_service_js_1 = require("../auth.service.js");
let AuthGuard = class AuthGuard {
    constructor(authService, tenantContext) {
        this.authService = authService;
        this.tenantContext = tenantContext;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);
        if (!token) {
            throw new common_1.UnauthorizedException('Missing credentials');
        }
        const userContext = await this.authService.validateToken(token, this.tenantContext.getContext());
        request.userContext = userContext;
        return true;
    }
    extractToken(request) {
        const header = request.headers['authorization'];
        if (typeof header === 'string' && header.startsWith('Bearer ')) {
            return header.substring(7);
        }
        const cookieToken = request.cookies?.aza8_token;
        return cookieToken ?? null;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_js_1.AuthService,
        tenant_context_service_js_1.TenantContextService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map