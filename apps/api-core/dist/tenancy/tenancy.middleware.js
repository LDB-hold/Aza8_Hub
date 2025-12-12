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
const tenant_context_store_js_1 = require("./tenant-context.store.js");
let TenancyMiddleware = class TenancyMiddleware {
    constructor(tenancyService, tenantContextStore) {
        this.tenancyService = tenancyService;
        this.tenantContextStore = tenantContextStore;
    }
    async use(req, _res, next) {
        // simple trace to ensure middleware runs
        // eslint-disable-next-line no-console
        console.debug('[TenancyMiddleware] host', req.headers.host, 'forwarded', req.headers['x-forwarded-host']);
        const forwarded = req.headers['x-forwarded-host'];
        const hostHeader = Array.isArray(forwarded) ? forwarded[0] : forwarded;
        const host = hostHeader || req.headers.host;
        const tenantSlugHeader = req.headers['x-tenant-slug'];
        const tenantSlug = Array.isArray(tenantSlugHeader) ? tenantSlugHeader[0] : tenantSlugHeader;
        req.tenantContext = await this.tenancyService.resolveContext(host, tenantSlug);
        return this.tenantContextStore.runWithContext(req.tenantContext, () => next());
    }
};
exports.TenancyMiddleware = TenancyMiddleware;
exports.TenancyMiddleware = TenancyMiddleware = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenancy_service_js_1.TenancyService,
        tenant_context_store_js_1.TenantContextStore])
], TenancyMiddleware);
//# sourceMappingURL=tenancy.middleware.js.map