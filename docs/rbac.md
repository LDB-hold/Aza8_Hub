# RBAC Reference

## Role scopes
- `GLOBAL_AZA8` – Internal hub permissions (operators, account managers, admins). Evaluated when `isHubRequest` is true.
- `TENANT` – Roles evaluated inside tenant portals (owners, managers, marketing, suppliers).
- `PLUGIN` – Extension-level granularity for future plugin marketplace enforcement.

## Base roles
| Role | Scope | Summary |
| --- | --- | --- |
| `AZA8_ADMIN` | GLOBAL_AZA8 | Full access to hub configuration, tenant catalog, and sensitive tooling. |
| `AZA8_ACCOUNT_MANAGER` | GLOBAL_AZA8 | Manage assigned tenants, quotas, and onboarding. |
| `AZA8_OPERATOR` | GLOBAL_AZA8 | Operate shared tooling (support, auditing) with limited tenant management. |
| `TENANT_OWNER` | TENANT | Owns tenant configuration, billing, plugin enablement. |
| `TENANT_MANAGER` | TENANT | Manages day-to-day data and operations. |
| `TENANT_MARKETING` | TENANT | Access to marketing plugins, campaigns, lead ingestion. |
| `TENANT_SUPPLIER` | TENANT | Access scoped to supplier/inventory plugins. |

## Permissions mapping
- Roles map to `Permission` records through `RolePermission` join rows. The skeleton seeds base roles automatically when users authenticate; permissions can then express fine-grained actions such as `TENANT_MANAGE_USERS`.
- Guards expose `@RequireRoles()` for coarse enforcement today. As permissions mature, add `@RequirePermissions()` metadata that the RBAC guard can evaluate using the same request context.
