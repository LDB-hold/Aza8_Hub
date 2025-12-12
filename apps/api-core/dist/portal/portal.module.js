"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortalModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_js_1 = require("../auth/auth.module.js");
const rbac_module_js_1 = require("../rbac/rbac.module.js");
const tasks_controller_js_1 = require("./tools/tasks.controller.js");
const files_controller_js_1 = require("./tools/files.controller.js");
const requests_controller_js_1 = require("./tools/requests.controller.js");
const reports_controller_js_1 = require("./tools/reports.controller.js");
const members_controller_js_1 = require("./team/members.controller.js");
const invites_controller_js_1 = require("./team/invites.controller.js");
const audit_controller_js_1 = require("./audit.controller.js");
let PortalModule = class PortalModule {
};
exports.PortalModule = PortalModule;
exports.PortalModule = PortalModule = __decorate([
    (0, common_1.Module)({
        imports: [auth_module_js_1.AuthModule, rbac_module_js_1.RbacModule],
        controllers: [
            tasks_controller_js_1.PortalTasksController,
            files_controller_js_1.PortalFilesController,
            requests_controller_js_1.PortalRequestsController,
            reports_controller_js_1.PortalReportsController,
            members_controller_js_1.PortalMembersController,
            invites_controller_js_1.PortalInvitesController,
            audit_controller_js_1.PortalAuditController
        ]
    })
], PortalModule);
//# sourceMappingURL=portal.module.js.map