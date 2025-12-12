export const TOOL_KEYS = ['tasks', 'files', 'requests', 'reports'];
export const PERMISSIONS = [
    { key: 'HUB_DASHBOARD_VIEW', description: 'Ver dashboard do hub', scope: 'HUB' },
    { key: 'HUB_TENANT_READ', description: 'Ler tenants', scope: 'HUB' },
    { key: 'HUB_TENANT_WRITE', description: 'Criar/editar tenants', scope: 'HUB' },
    { key: 'HUB_TENANT_USERS_READ', description: 'Listar usuários de tenant', scope: 'HUB' },
    { key: 'HUB_TENANT_USERS_WRITE', description: 'Gerenciar usuários de tenant', scope: 'HUB' },
    { key: 'HUB_TOOLS_MANAGE', description: 'Habilitar/desabilitar ferramentas', scope: 'HUB' },
    { key: 'HUB_RBAC_VIEW', description: 'Ver RBAC do hub', scope: 'HUB' },
    { key: 'HUB_AUDIT_READ', description: 'Ler auditoria do hub', scope: 'HUB' },
    { key: 'PORTAL_DASHBOARD_VIEW', description: 'Ver dashboard do portal', scope: 'PORTAL' },
    { key: 'TENANT_MEMBER_READ', description: 'Listar membros do tenant', scope: 'PORTAL' },
    { key: 'TENANT_MEMBER_INVITE', description: 'Convidar novos membros', scope: 'PORTAL' },
    { key: 'TENANT_MEMBER_ROLE_UPDATE', description: 'Alterar papel de membro', scope: 'PORTAL' },
    { key: 'TENANT_SETTINGS_READ', description: 'Ver configurações do tenant', scope: 'PORTAL' },
    { key: 'TENANT_SETTINGS_WRITE', description: 'Editar configurações do tenant', scope: 'PORTAL' },
    { key: 'TENANT_BILLING_READ', description: 'Ver billing do tenant', scope: 'PORTAL' },
    { key: 'TENANT_BILLING_WRITE', description: 'Gerenciar billing do tenant', scope: 'PORTAL' },
    { key: 'AUDIT_READ', description: 'Ler auditoria do tenant', scope: 'PORTAL' },
    { key: 'TOOL_TASKS_READ', description: 'Ler tasks', scope: 'PORTAL' },
    { key: 'TOOL_TASKS_WRITE', description: 'Criar/editar/deletar tasks', scope: 'PORTAL' },
    { key: 'TOOL_FILES_READ', description: 'Ler arquivos', scope: 'PORTAL' },
    { key: 'TOOL_FILES_WRITE', description: 'Criar arquivos', scope: 'PORTAL' },
    { key: 'TOOL_REQUESTS_READ', description: 'Ler requests', scope: 'PORTAL' },
    { key: 'TOOL_REQUESTS_CREATE', description: 'Criar requests', scope: 'PORTAL' },
    { key: 'TOOL_REQUESTS_APPROVE', description: 'Aprovar/Rejeitar requests', scope: 'PORTAL' },
    { key: 'TOOL_REPORTS_READ', description: 'Ler reports', scope: 'PORTAL' }
];
export const ROLES = [
    { key: 'AZA8_ADMIN', name: 'Aza8 Admin', scope: 'HUB', description: 'Acesso total hub' },
    { key: 'AZA8_SUPPORT', name: 'Aza8 Support', scope: 'HUB', description: 'Suporte somente leitura' },
    {
        key: 'AZA8_ACCOUNT_MANAGER',
        name: 'Account Manager',
        scope: 'HUB',
        description: 'Gestão de tenants e ferramentas'
    },
    { key: 'OWNER', name: 'Owner', scope: 'PORTAL', description: 'Controle total do tenant' },
    { key: 'MANAGER', name: 'Manager', scope: 'PORTAL', description: 'Gestão operacional do tenant' },
    { key: 'MEMBER', name: 'Member', scope: 'PORTAL', description: 'Colaborador padrão' },
    { key: 'SUPPLIER', name: 'Supplier', scope: 'PORTAL', description: 'Fornecedor convidado' }
];
export const ROLE_PERMISSIONS = [
    {
        role: 'AZA8_ADMIN',
        permissions: [
            'HUB_DASHBOARD_VIEW',
            'HUB_TENANT_READ',
            'HUB_TENANT_WRITE',
            'HUB_TENANT_USERS_READ',
            'HUB_TENANT_USERS_WRITE',
            'HUB_TOOLS_MANAGE',
            'HUB_RBAC_VIEW',
            'HUB_AUDIT_READ'
        ]
    },
    {
        role: 'AZA8_SUPPORT',
        permissions: ['HUB_DASHBOARD_VIEW', 'HUB_TENANT_READ', 'HUB_TENANT_USERS_READ', 'HUB_AUDIT_READ']
    },
    {
        role: 'AZA8_ACCOUNT_MANAGER',
        permissions: [
            'HUB_DASHBOARD_VIEW',
            'HUB_TENANT_READ',
            'HUB_TENANT_WRITE',
            'HUB_TENANT_USERS_READ',
            'HUB_TOOLS_MANAGE',
            'HUB_AUDIT_READ'
        ]
    },
    {
        role: 'OWNER',
        permissions: [
            'PORTAL_DASHBOARD_VIEW',
            'TENANT_MEMBER_READ',
            'TENANT_MEMBER_INVITE',
            'TENANT_MEMBER_ROLE_UPDATE',
            'TENANT_SETTINGS_READ',
            'TENANT_SETTINGS_WRITE',
            'TENANT_BILLING_READ',
            'TENANT_BILLING_WRITE',
            'AUDIT_READ',
            'TOOL_TASKS_READ',
            'TOOL_TASKS_WRITE',
            'TOOL_FILES_READ',
            'TOOL_FILES_WRITE',
            'TOOL_REQUESTS_READ',
            'TOOL_REQUESTS_CREATE',
            'TOOL_REQUESTS_APPROVE',
            'TOOL_REPORTS_READ'
        ]
    },
    {
        role: 'MANAGER',
        permissions: [
            'PORTAL_DASHBOARD_VIEW',
            'TENANT_MEMBER_READ',
            'TENANT_MEMBER_INVITE',
            'TENANT_SETTINGS_READ',
            'TENANT_SETTINGS_WRITE',
            'AUDIT_READ',
            'TOOL_TASKS_READ',
            'TOOL_TASKS_WRITE',
            'TOOL_FILES_READ',
            'TOOL_FILES_WRITE',
            'TOOL_REQUESTS_READ',
            'TOOL_REQUESTS_CREATE',
            'TOOL_REPORTS_READ'
        ]
    },
    {
        role: 'MEMBER',
        permissions: [
            'PORTAL_DASHBOARD_VIEW',
            'TOOL_TASKS_READ',
            'TOOL_TASKS_WRITE',
            'TOOL_FILES_READ',
            'TOOL_FILES_WRITE',
            'TOOL_REQUESTS_READ',
            'TOOL_REQUESTS_CREATE',
            'TOOL_REPORTS_READ'
        ]
    },
    {
        role: 'SUPPLIER',
        permissions: ['PORTAL_DASHBOARD_VIEW', 'TOOL_FILES_READ', 'TOOL_FILES_WRITE', 'TOOL_REQUESTS_READ']
    }
];
export const rolePermissionsMap = ROLE_PERMISSIONS.reduce((acc, item) => {
    acc[item.role] = item.permissions;
    return acc;
}, {});
//# sourceMappingURL=rbac-config.js.map