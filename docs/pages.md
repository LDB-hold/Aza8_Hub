# Páginas e permissões

Todas as páginas exibem título, descrição curta, bloco de “Required permissions”, e estados vazio/carregando/erro. Menus e rota são guardados pelo config de navegação.

## Público
- `/` – redireciona para `/hub/dashboard` quando host de hub ou `/app/dashboard` quando host de tenant.
- `/auth/login` – quick login por e-mail seed; cria cookie httpOnly.
- `/auth/logout` – limpa sessão.
- `/auth/invite/accept` – aceita convite via token.
- `/403`, `/404`, `/500` – páginas de erro.

## Hub (`hub.aza8.com.br`)
- `/hub` → redirect `/hub/dashboard` (perm: `HUB_DASHBOARD_VIEW`)
- `/hub/dashboard` (perm: `HUB_DASHBOARD_VIEW`)
- `/hub/tenants` (perm: `HUB_TENANT_READ`)
- `/hub/tenants/new` (perm: `HUB_TENANT_WRITE`)
- `/hub/tenants/[tenantId]/overview` (perm: `HUB_TENANT_READ`)
- `/hub/tenants/[tenantId]/users` (perm: `HUB_TENANT_USERS_READ`)
- `/hub/tenants/[tenantId]/tools` (perm: `HUB_TOOLS_MANAGE`)
- `/hub/rbac/roles` (perm: `HUB_RBAC_VIEW`)
- `/hub/rbac/permissions` (perm: `HUB_RBAC_VIEW`)
- `/hub/audit` (perm: `HUB_AUDIT_READ`)

## Portal (`{tenant}.aza8.com.br`)
- `/app` → redirect `/app/dashboard` (perm: `PORTAL_DASHBOARD_VIEW`)
- `/app/dashboard` (perm: `PORTAL_DASHBOARD_VIEW`) – mostra cards de ferramentas instaladas.
- `/app/tools` (perm: `PORTAL_DASHBOARD_VIEW`) – lista de ferramentas instaladas.
- `/app/tools/tasks` (perms: `TOOL_TASKS_READ`; ações de escrita exigem `TOOL_TASKS_WRITE`)
- `/app/tools/files` (perms: `TOOL_FILES_READ`; upload exige `TOOL_FILES_WRITE`)
- `/app/tools/requests` (perms: `TOOL_REQUESTS_READ`; criar exige `TOOL_REQUESTS_CREATE`; aprovar/rejeitar exige `TOOL_REQUESTS_APPROVE`)
- `/app/tools/reports` (perms: `TOOL_REPORTS_READ`)
- `/app/team/members` (perm: `TENANT_MEMBER_READ`; mudar role exige `TENANT_MEMBER_ROLE_UPDATE`)
- `/app/team/invitations` (perm: `TENANT_MEMBER_INVITE`)
- `/app/settings/profile` (perm: `PORTAL_DASHBOARD_VIEW`)
- `/app/settings/organization` (perm: `TENANT_SETTINGS_READ`; edição exige `TENANT_SETTINGS_WRITE`)
- `/app/settings/billing` (perms: `TENANT_BILLING_READ`/`TENANT_BILLING_WRITE`; OWNER obrigatório)
- `/app/audit` (perm: `AUDIT_READ`)
