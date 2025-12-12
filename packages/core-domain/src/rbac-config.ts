export type PermissionScope = 'GLOBAL_AZA8' | 'TENANT' | 'PLUGIN';

export type RoleCode =
  | 'AZA8_ADMIN'
  | 'AZA8_ACCOUNT_MANAGER'
  | 'AZA8_OPERATOR'
  | 'TENANT_OWNER'
  | 'TENANT_MANAGER'
  | 'TENANT_MARKETING'
  | 'TENANT_SUPPLIER';

export type PermissionCode =
  | 'HUB_TENANTS_READ'
  | 'HUB_TENANTS_MANAGE'
  | 'HUB_AUDITLOG_READ'
  | 'HUB_PLUGINS_MANAGE'
  | 'TENANT_SETTINGS_READ'
  | 'TENANT_SETTINGS_MANAGE'
  | 'TENANT_MEMBERS_MANAGE'
  | 'TENANT_BILLING_READ'
  | 'TENANT_BILLING_MANAGE'
  | 'TENANT_AUDITLOG_READ'
  | 'TENANT_PLUGINS_MANAGE'
  | 'TENANT_PLUGINS_USE';

export type PermissionDefinition = {
  code: PermissionCode;
  scope: PermissionScope;
  description: string;
};

export type RoleDefinition = {
  code: RoleCode;
  scope: PermissionScope;
  description: string;
};

export type RolePermissionsDefinition = {
  roleCode: RoleCode;
  permissionCodes: PermissionCode[];
};

export const BASE_PERMISSIONS: PermissionDefinition[] = [
  {
    code: 'HUB_TENANTS_READ',
    scope: 'GLOBAL_AZA8',
    description: 'List and view tenants from the hub'
  },
  {
    code: 'HUB_TENANTS_MANAGE',
    scope: 'GLOBAL_AZA8',
    description: 'Create, update or deactivate tenants from the hub'
  },
  {
    code: 'HUB_AUDITLOG_READ',
    scope: 'GLOBAL_AZA8',
    description: 'Read audit logs from the hub context'
  },
  {
    code: 'HUB_PLUGINS_MANAGE',
    scope: 'GLOBAL_AZA8',
    description: 'Manage the global plugin catalog'
  },
  {
    code: 'TENANT_SETTINGS_READ',
    scope: 'TENANT',
    description: 'View tenant settings'
  },
  {
    code: 'TENANT_SETTINGS_MANAGE',
    scope: 'TENANT',
    description: 'Update tenant settings'
  },
  {
    code: 'TENANT_MEMBERS_MANAGE',
    scope: 'TENANT',
    description: 'Manage tenant members and invitations'
  },
  {
    code: 'TENANT_BILLING_READ',
    scope: 'TENANT',
    description: 'Read tenant billing details'
  },
  {
    code: 'TENANT_BILLING_MANAGE',
    scope: 'TENANT',
    description: 'Manage tenant billing and subscriptions'
  },
  {
    code: 'TENANT_AUDITLOG_READ',
    scope: 'TENANT',
    description: 'Read tenant audit logs'
  },
  {
    code: 'TENANT_PLUGINS_MANAGE',
    scope: 'TENANT',
    description: 'Enable or disable plugins for the tenant'
  },
  {
    code: 'TENANT_PLUGINS_USE',
    scope: 'TENANT',
    description: 'Use enabled plugins in the tenant context'
  }
];

export const BASE_ROLES: RoleDefinition[] = [
  {
    code: 'AZA8_ADMIN',
    scope: 'GLOBAL_AZA8',
    description: 'Full access to hub operations and configuration'
  },
  {
    code: 'AZA8_ACCOUNT_MANAGER',
    scope: 'GLOBAL_AZA8',
    description: 'Manage tenants and oversee onboarding'
  },
  {
    code: 'AZA8_OPERATOR',
    scope: 'GLOBAL_AZA8',
    description: 'Operate hub tooling with limited management capabilities'
  },
  {
    code: 'TENANT_OWNER',
    scope: 'TENANT',
    description: 'Full control over tenant operations'
  },
  {
    code: 'TENANT_MANAGER',
    scope: 'TENANT',
    description: 'Manage day-to-day tenant operations'
  },
  {
    code: 'TENANT_MARKETING',
    scope: 'TENANT',
    description: 'Access to marketing-focused capabilities'
  },
  {
    code: 'TENANT_SUPPLIER',
    scope: 'TENANT',
    description: 'Access to supplier and inventory capabilities'
  }
];

export const ROLE_PERMISSION_MATRIX: RolePermissionsDefinition[] = [
  {
    roleCode: 'AZA8_ADMIN',
    permissionCodes: [
      'HUB_TENANTS_READ',
      'HUB_TENANTS_MANAGE',
      'HUB_AUDITLOG_READ',
      'HUB_PLUGINS_MANAGE'
    ]
  },
  {
    roleCode: 'AZA8_ACCOUNT_MANAGER',
    permissionCodes: ['HUB_TENANTS_READ', 'HUB_TENANTS_MANAGE', 'HUB_AUDITLOG_READ']
  },
  {
    roleCode: 'AZA8_OPERATOR',
    permissionCodes: ['HUB_TENANTS_READ', 'HUB_AUDITLOG_READ']
  },
  {
    roleCode: 'TENANT_OWNER',
    permissionCodes: [
      'TENANT_SETTINGS_READ',
      'TENANT_SETTINGS_MANAGE',
      'TENANT_MEMBERS_MANAGE',
      'TENANT_BILLING_READ',
      'TENANT_BILLING_MANAGE',
      'TENANT_AUDITLOG_READ',
      'TENANT_PLUGINS_MANAGE',
      'TENANT_PLUGINS_USE'
    ]
  },
  {
    roleCode: 'TENANT_MANAGER',
    permissionCodes: [
      'TENANT_SETTINGS_READ',
      'TENANT_SETTINGS_MANAGE',
      'TENANT_MEMBERS_MANAGE',
      'TENANT_AUDITLOG_READ',
      'TENANT_PLUGINS_MANAGE',
      'TENANT_PLUGINS_USE'
    ]
  },
  {
    roleCode: 'TENANT_MARKETING',
    permissionCodes: ['TENANT_SETTINGS_READ', 'TENANT_PLUGINS_USE']
  },
  {
    roleCode: 'TENANT_SUPPLIER',
    permissionCodes: ['TENANT_SETTINGS_READ', 'TENANT_PLUGINS_USE']
  }
];
