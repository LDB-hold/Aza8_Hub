"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirePermissions = exports.RequireRoles = exports.REQUIRE_PERMISSIONS_KEY = exports.REQUIRE_ROLES_KEY = exports.REQUIRE_PERMISSIONS_METADATA_KEY = exports.REQUIRE_ROLES_METADATA_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.REQUIRE_ROLES_METADATA_KEY = 'rbac:roles';
exports.REQUIRE_PERMISSIONS_METADATA_KEY = 'rbac:permissions';
// Aliases kept for backwards compatibility with existing metadata consumers.
exports.REQUIRE_ROLES_KEY = exports.REQUIRE_ROLES_METADATA_KEY;
exports.REQUIRE_PERMISSIONS_KEY = exports.REQUIRE_PERMISSIONS_METADATA_KEY;
function RequireRoles(...roles) {
    return (0, common_1.SetMetadata)(exports.REQUIRE_ROLES_METADATA_KEY, roles);
}
exports.RequireRoles = RequireRoles;
// Attach to controllers/handlers to enforce permission codes for the active context.
function RequirePermissions(...permissions) {
    return (0, common_1.SetMetadata)(exports.REQUIRE_PERMISSIONS_METADATA_KEY, permissions);
}
exports.RequirePermissions = RequirePermissions;
//# sourceMappingURL=rbac.decorator.js.map