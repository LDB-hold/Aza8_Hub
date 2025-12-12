# RBAC Reference

## Role scopes
- `GLOBAL_AZA8` – Internal hub permissions (operators, account managers, admins). Avaliados quando `isHubRequest` é verdadeiro.
- `TENANT` – Papéis avaliados dentro de portais de tenant (owners, managers, marketing, suppliers).
- `PLUGIN` – Granularidade de extensões para o marketplace futuro.

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

## Permissions matrix

### Permission codes por escopo
- **GLOBAL_AZA8**: `HUB_TENANTS_READ`, `HUB_TENANTS_MANAGE`, `HUB_AUDITLOG_READ`, `HUB_PLUGINS_MANAGE`
- **TENANT**: `TENANT_SETTINGS_READ`, `TENANT_SETTINGS_MANAGE`, `TENANT_MEMBERS_MANAGE`, `TENANT_BILLING_READ`, `TENANT_BILLING_MANAGE`, `TENANT_AUDITLOG_READ`, `TENANT_PLUGINS_MANAGE`, `TENANT_PLUGINS_USE`

### Mapeamento inicial de papéis → permissões
| Role | Permissions |
| --- | --- |
| `AZA8_ADMIN` | HUB_TENANTS_READ, HUB_TENANTS_MANAGE, HUB_AUDITLOG_READ, HUB_PLUGINS_MANAGE |
| `AZA8_ACCOUNT_MANAGER` | HUB_TENANTS_READ, HUB_TENANTS_MANAGE, HUB_AUDITLOG_READ |
| `AZA8_OPERATOR` | HUB_TENANTS_READ, HUB_AUDITLOG_READ |
| `TENANT_OWNER` | TENANT_SETTINGS_READ, TENANT_SETTINGS_MANAGE, TENANT_MEMBERS_MANAGE, TENANT_BILLING_READ, TENANT_BILLING_MANAGE, TENANT_AUDITLOG_READ, TENANT_PLUGINS_MANAGE, TENANT_PLUGINS_USE |
| `TENANT_MANAGER` | TENANT_SETTINGS_READ, TENANT_SETTINGS_MANAGE, TENANT_MEMBERS_MANAGE, TENANT_AUDITLOG_READ, TENANT_PLUGINS_MANAGE, TENANT_PLUGINS_USE |
| `TENANT_MARKETING` | TENANT_PLUGINS_USE |
| `TENANT_SUPPLIER` | TENANT_PLUGINS_USE |

## Guards e decoradores
- `@RequireRoles()` permanece disponível para restrições mais amplas (ex.: apenas `AZA8_ADMIN`).
- `@RequirePermissions()` é o caminho preferido para regras de negócio e já está aplicado em rotas do hub (ex.: `GET /tenants`).
