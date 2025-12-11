"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireRoles = exports.REQUIRE_ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.REQUIRE_ROLES_KEY = 'require_roles';
const RequireRoles = (...roles) => (0, common_1.SetMetadata)(exports.REQUIRE_ROLES_KEY, roles);
exports.RequireRoles = RequireRoles;
//# sourceMappingURL=rbac.decorator.js.map