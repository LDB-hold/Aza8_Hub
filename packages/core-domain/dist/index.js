import { rolePermissionsMap, ROLES, PERMISSIONS, TOOL_KEYS } from './rbac-config.js';
export { rolePermissionsMap, ROLES, PERMISSIONS, TOOL_KEYS };
export const HUB_HOST = 'hub.aza8.com.br';
export const isHubHost = (host) => {
    if (!host)
        return false;
    return host.split(':')[0] === HUB_HOST || host.startsWith('hub.');
};
export const extractTenantSlugFromHost = (host) => {
    if (!host)
        return null;
    const normalized = host.split(':')[0];
    if (normalized === HUB_HOST || normalized.startsWith('hub.')) {
        return null;
    }
    const [slug] = normalized.split('.');
    return slug || null;
};
export const getPermissionsForRole = (role) => {
    if (!role)
        return [];
    return rolePermissionsMap[role] ?? [];
};
export const isToolKey = (tool) => {
    return TOOL_KEYS.includes(tool);
};
//# sourceMappingURL=index.js.map