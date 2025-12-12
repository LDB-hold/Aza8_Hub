"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenancyModule = void 0;
const common_1 = require("@nestjs/common");
const tenant_context_service_js_1 = require("./tenant-context.service.js");
const tenancy_service_js_1 = require("./tenancy.service.js");
const tenancy_middleware_js_1 = require("./tenancy.middleware.js");
const tenant_context_store_js_1 = require("./tenant-context.store.js");
let TenancyModule = class TenancyModule {
    configure(consumer) {
        consumer.apply(tenancy_middleware_js_1.TenancyMiddleware).forRoutes('*');
    }
};
exports.TenancyModule = TenancyModule;
exports.TenancyModule = TenancyModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [tenant_context_service_js_1.TenantContextService, tenancy_service_js_1.TenancyService, tenant_context_store_js_1.TenantContextStore],
        exports: [tenant_context_service_js_1.TenantContextService, tenancy_service_js_1.TenancyService, tenant_context_store_js_1.TenantContextStore]
    })
], TenancyModule);
//# sourceMappingURL=tenancy.module.js.map