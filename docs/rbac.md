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

## Permissions matrix (v1)

### Permission codes por escopo
- **GLOBAL_AZA8**: `HUB_TENANTS_READ`, `HUB_TENANTS_MANAGE`, `HUB_AUDITLOG_READ`, `HUB_PLUGINS_MANAGE`
- **TENANT**: `TENANT_SETTINGS_READ`, `TENANT_SETTINGS_MANAGE`, `TENANT_MEMBERS_MANAGE`, `TENANT_BILLING_READ`, `TENANT_BILLING_MANAGE`, `TENANT_AUDITLOG_READ`, `TENANT_PLUGINS_MANAGE`, `TENANT_PLUGINS_USE`

### Mapeamento inicial de papéis → permissões
| Role | HUB_TENANTS_READ | HUB_TENANTS_MANAGE | HUB_AUDITLOG_READ | HUB_PLUGINS_MANAGE | TENANT_SETTINGS_READ | TENANT_SETTINGS_MANAGE | TENANT_MEMBERS_MANAGE | TENANT_BILLING_READ | TENANT_BILLING_MANAGE | TENANT_AUDITLOG_READ | TENANT_PLUGINS_MANAGE | TENANT_PLUGINS_USE |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `AZA8_ADMIN` | X | X | X | X | – | – | – | – | – | – | – | – |
| `AZA8_ACCOUNT_MANAGER` | X | X | X | – | – | – | – | – | – | – | – | – |
| `AZA8_OPERATOR` | X | – | X | – | – | – | – | – | – | – | – | – |
| `TENANT_OWNER` | – | – | – | – | X | X | X | X | X | X | X | X |
| `TENANT_MANAGER` | – | – | – | – | X | X | X | – | – | X | X | X |
| `TENANT_MARKETING` | – | – | – | – | X | – | – | – | – | – | – | X |
| `TENANT_SUPPLIER` | – | – | – | – | X | – | – | – | – | – | – | X |

## Guards e decoradores
- `@RequireRoles()` permanece disponível para restrições mais amplas (ex.: apenas `AZA8_ADMIN`).
- `@RequirePermissions()` é o caminho preferido para regras de negócio (billing, membros, plugins, gestão de tenants).

### Guide: Roles vs Permissions
- Use `@RequireRoles()` quando a regra é estrutural ou extremamente sensível (ex.: somente `AZA8_ADMIN` em uma operação destrutiva do hub).
- Use `@RequirePermissions()` para todas as operações de negócio: leitura/gestão de tenants, billing, membros, audit log, plugins.
- Combinar ambos é válido para camadas extras em operações globais sensíveis.

Exemplos:
```ts
@UseGuards(AuthGuard, RbacGuard)
@RequirePermissions('HUB_TENANTS_READ')
@Get('/tenants')
listTenants() { ... }
```

```ts
@UseGuards(AuthGuard, RbacGuard)
@RequirePermissions('TENANT_MEMBERS_MANAGE')
@Post('/tenant/members')
addMember() { ... }
```

```ts
@UseGuards(AuthGuard, RbacGuard)
@RequireRoles('AZA8_ADMIN')
@RequirePermissions('HUB_TENANTS_MANAGE')
@Post('/tenants')
createTenant() { ... }
```
