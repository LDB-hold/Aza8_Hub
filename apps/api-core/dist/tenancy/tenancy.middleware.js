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
exports.TenancyMiddleware = void 0;
const common_1 = require("@nestjs/common");
const tenancy_service_js_1 = require("./tenancy.service.js");
let TenancyMiddleware = class TenancyMiddleware {
    constructor(tenancyService) {
        this.tenancyService = tenancyService;
    }
    async use(req, _res, next) {
        const forwarded = req.headers['x-forwarded-host'];
        const hostHeader = Array.isArray(forwarded) ? forwarded[0] : forwarded;
        const host = hostHeader || req.headers.host;
        req.tenantContext = await this.tenancyService.resolveContext(host);
        next();
    }
};
exports.TenancyMiddleware = TenancyMiddleware;
exports.TenancyMiddleware = TenancyMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenancy_service_js_1.TenancyService])
], TenancyMiddleware);
//# sourceMappingURL=tenancy.middleware.js.map