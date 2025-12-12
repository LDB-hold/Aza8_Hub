"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HubModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_js_1 = require("../auth/auth.module.js");
const rbac_module_js_1 = require("../rbac/rbac.module.js");
const tenants_controller_js_1 = require("../core/tenants/tenants.controller.js");
const tenants_service_js_1 = require("../core/tenants/tenants.service.js");
const tools_controller_js_1 = require("./tools.controller.js");
const hub_audit_controller_js_1 = require("./hub-audit.controller.js");
let HubModule = class HubModule {
};
exports.HubModule = HubModule;
exports.HubModule = HubModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_js_1.AuthModule, rbac_module_js_1.RbacModule],
        controllers: [tenants_controller_js_1.TenantsController, tools_controller_js_1.HubToolsController, hub_audit_controller_js_1.HubAuditController],
        providers: [tenants_service_js_1.TenantsService]
    })
], HubModule);
//# sourceMappingURL=hub.module.js.map