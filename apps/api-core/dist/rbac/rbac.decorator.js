"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirePermissions = exports.REQUIRE_PERMISSIONS_METADATA_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.REQUIRE_PERMISSIONS_METADATA_KEY = 'require_permissions';
function RequirePermissions(...permissions) {
    return (0, common_1.SetMetadata)(exports.REQUIRE_PERMISSIONS_METADATA_KEY, permissions);
}
exports.RequirePermissions = RequirePermissions;
//# sourceMappingURL=rbac.decorator.js.map