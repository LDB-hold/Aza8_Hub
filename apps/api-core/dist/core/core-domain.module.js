"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoreDomainModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_js_1 = require("../auth/auth.module.js");
const rbac_module_js_1 = require("../rbac/rbac.module.js");
const tenancy_module_js_1 = require("../tenancy/tenancy.module.js");
const tenants_controller_js_1 = require("./tenants/tenants.controller.js");
const tenants_service_js_1 = require("./tenants/tenants.service.js");
const me_controller_js_1 = require("./me/me.controller.js");
let CoreDomainModule = class CoreDomainModule {
};
exports.CoreDomainModule = CoreDomainModule;
exports.CoreDomainModule = CoreDomainModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_js_1.AuthModule, rbac_module_js_1.RbacModule, tenancy_module_js_1.TenancyModule],
        controllers: [me_controller_js_1.MeController, tenants_controller_js_1.TenantsController],
        providers: [tenants_service_js_1.TenantsService]
    })
], CoreDomainModule);
//# sourceMappingURL=core-domain.module.js.map