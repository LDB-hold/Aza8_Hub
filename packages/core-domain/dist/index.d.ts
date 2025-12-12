import type { PermissionKey, RoleKey, RoleScope, ToolKey } from './rbac-config.js';
import { rolePermissionsMap, ROLES, PERMISSIONS, TOOL_KEYS } from './rbac-config.js';
export type { PermissionKey, RoleKey, RoleScope, ToolKey };
export { rolePermissionsMap, ROLES, PERMISSIONS, TOOL_KEYS };
export interface Tenant {
    id: string;
    slug: string;
    name: string;
    createdAt: Date;
}
export interface User {
    id: string;
    email: string;
    name: string;
    type: 'HUB' | 'PORTAL';
    createdAt: Date;
}
export interface Membership {
    id: string;
    tenantId: string;
    userId: string;
    roleKey: RoleKey;
}
export interface TenantContext {
    tenantId: string | null;
    tenantSlug: string | null;
    isHubRequest: boolean;
}
export interface CurrentUserContext {
    user: User;
    membership: Membership | null;
    tenantContext: TenantContext;
    role: RoleKey | null;
    permissions: PermissionKey[];
}
export declare const HUB_HOST = "hub.aza8.com.br";
export declare const isHubHost: (host?: string | null) => boolean;
export declare const extractTenantSlugFromHost: (host?: string | null) => string | null;
export declare const getPermissionsForRole: (role?: RoleKey | null) => PermissionKey[];
export declare const isToolKey: (tool: string) => tool is "tasks" | "files" | "requests" | "reports";
