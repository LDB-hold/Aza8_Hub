# Páginas e permissões (estado atual – apps/web)

Todas as páginas exibem título, descrição curta e seguem guardas de sessão/permiso. A navegação e os guards usam `requiredPermissions` e, quando aplicável, verificam ferramenta instalada.

## Hosts
- Hub: `hub.localhost` (ou `hub.aza8.com.br` em produção)
- Portal: `{slug}.localhost` (ou `{slug}.aza8.com.br`)

## Público
- `/` – redireciona para `/dashboard`.
- `/login` – login rápido (mock) por e-mail seed; cria cookie httpOnly.
- `/logout` – limpa sessão.
- `/403`, `/404`, `/500` – páginas de erro.

## Portal (host `{tenant}.localhost`)
- `/dashboard` (perm: `PORTAL_DASHBOARD_VIEW`) – cards de ferramentas instaladas.
- `/tools/tasks` (perms: `TOOL_TASKS_READ`; escrever exige `TOOL_TASKS_WRITE`)
- `/tools/files` (perms: `TOOL_FILES_READ`; upload exige `TOOL_FILES_WRITE`)
- `/tools/requests` (perms: `TOOL_REQUESTS_READ`; criar exige `TOOL_REQUESTS_CREATE`; aprovar/rejeitar exige `TOOL_REQUESTS_APPROVE`)
- `/tools/reports` (perm: `TOOL_REPORTS_READ`)
- `/team/members` (perm: `TENANT_MEMBER_READ`; mudar role exige `TENANT_MEMBER_ROLE_UPDATE`)
- `/team/invitations` (perm: `TENANT_MEMBER_INVITE`)
- `/settings/profile` (perm: `PORTAL_DASHBOARD_VIEW`)
- `/settings/organization` (perm: `TENANT_SETTINGS_READ`; edição exige `TENANT_SETTINGS_WRITE`)
- `/settings/billing` (perms: `TENANT_BILLING_READ`/`TENANT_BILLING_WRITE`; OWNER obrigatório)
- `/audit` (perm: `AUDIT_READ`)

## Hub (a implementar na camada web unificada)
- Rotas previstas: `/hub/dashboard`, `/hub/tenants`, `/hub/tenants/new`, `/hub/rbac/*`, `/hub/audit` (permissões de hub conforme `docs/rbac.md`).
