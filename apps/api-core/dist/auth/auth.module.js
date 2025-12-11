"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const app_config_module_js_1 = require("../config/app-config.module.js");
const app_config_service_js_1 = require("../config/app-config.service.js");
const rbac_module_js_1 = require("../rbac/rbac.module.js");
const tenancy_module_js_1 = require("../tenancy/tenancy.module.js");
const auth_service_js_1 = require("./auth.service.js");
const auth_controller_js_1 = require("./auth.controller.js");
const auth_guard_js_1 = require("./guards/auth.guard.js");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            app_config_module_js_1.AppConfigModule,
            rbac_module_js_1.RbacModule,
            tenancy_module_js_1.TenancyModule,
            jwt_1.JwtModule.registerAsync({
                inject: [app_config_service_js_1.AppConfigService],
                useFactory: (configService) => ({
                    secret: configService.apiConfig.authSecret,
                    signOptions: { expiresIn: '7d' }
                })
            })
        ],
        controllers: [auth_controller_js_1.AuthController],
        providers: [auth_service_js_1.AuthService, auth_guard_js_1.AuthGuard],
        exports: [auth_service_js_1.AuthService, auth_guard_js_1.AuthGuard]
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map