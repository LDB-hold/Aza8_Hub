export type RoleKey = 'AZA8_ADMIN' | 'AZA8_SUPPORT' | 'AZA8_ACCOUNT_MANAGER' | 'OWNER' | 'MANAGER' | 'MEMBER' | 'SUPPLIER';
export type RoleScope = 'HUB' | 'PORTAL';
export type PermissionKey = 'HUB_DASHBOARD_VIEW' | 'HUB_TENANT_READ' | 'HUB_TENANT_WRITE' | 'HUB_TENANT_USERS_READ' | 'HUB_TENANT_USERS_WRITE' | 'HUB_TOOLS_MANAGE' | 'HUB_RBAC_VIEW' | 'HUB_AUDIT_READ' | 'PORTAL_DASHBOARD_VIEW' | 'TENANT_MEMBER_READ' | 'TENANT_MEMBER_INVITE' | 'TENANT_MEMBER_ROLE_UPDATE' | 'TENANT_SETTINGS_READ' | 'TENANT_SETTINGS_WRITE' | 'TENANT_BILLING_READ' | 'TENANT_BILLING_WRITE' | 'AUDIT_READ' | 'TOOL_TASKS_READ' | 'TOOL_TASKS_WRITE' | 'TOOL_FILES_READ' | 'TOOL_FILES_WRITE' | 'TOOL_REQUESTS_READ' | 'TOOL_REQUESTS_CREATE' | 'TOOL_REQUESTS_APPROVE' | 'TOOL_REPORTS_READ';
export declare const TOOL_KEYS: readonly ["tasks", "files", "requests", "reports"];
export type ToolKey = (typeof TOOL_KEYS)[number];
export type PermissionDefinition = {
    key: PermissionKey;
    description: string;
    scope: RoleScope;
};
export type RoleDefinition = {
    key: RoleKey;
    name: string;
    scope: RoleScope;
    description: string;
};
export type RolePermissionDefinition = {
    role: RoleKey;
    permissions: PermissionKey[];
};
export declare const PERMISSIONS: PermissionDefinition[];
export declare const ROLES: RoleDefinition[];
export declare const ROLE_PERMISSIONS: RolePermissionDefinition[];
export declare const rolePermissionsMap: Record<RoleKey, PermissionKey[]>;
