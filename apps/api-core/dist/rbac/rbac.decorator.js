"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirePermissions = exports.RequireRoles = exports.REQUIRE_PERMISSIONS_KEY = exports.REQUIRE_ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.REQUIRE_ROLES_KEY = 'require_roles';
exports.REQUIRE_PERMISSIONS_KEY = 'require_permissions';
const RequireRoles = (...roles) => (0, common_1.SetMetadata)(exports.REQUIRE_ROLES_KEY, roles);
exports.RequireRoles = RequireRoles;
const RequirePermissions = (...permissions) => (0, common_1.SetMetadata)(exports.REQUIRE_PERMISSIONS_KEY, permissions);
exports.RequirePermissions = RequirePermissions;
//# sourceMappingURL=rbac.decorator.js.map