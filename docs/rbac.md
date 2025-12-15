# RBAC – Aza8 Hub/Portal

## Permissões
- Hub: `HUB_DASHBOARD_VIEW`, `HUB_TENANT_READ`, `HUB_TENANT_WRITE`, `HUB_TENANT_USERS_READ`, `HUB_TENANT_USERS_WRITE`, `HUB_TOOLS_MANAGE`, `HUB_RBAC_VIEW`, `HUB_AUDIT_READ`
- Portal: `PORTAL_DASHBOARD_VIEW`, `TENANT_MEMBER_READ`, `TENANT_MEMBER_INVITE`, `TENANT_MEMBER_ROLE_UPDATE`, `TENANT_SETTINGS_READ`, `TENANT_SETTINGS_WRITE`, `TENANT_BILLING_READ`, `TENANT_BILLING_WRITE`, `AUDIT_READ`
- Ferramentas: `TOOL_TASKS_READ`, `TOOL_TASKS_WRITE`, `TOOL_FILES_READ`, `TOOL_FILES_WRITE`, `TOOL_REQUESTS_READ`, `TOOL_REQUESTS_CREATE`, `TOOL_REQUESTS_APPROVE`, `TOOL_REPORTS_READ`

## Roles e mapeamento
- **AZA8_ADMIN** (HUB): todas as permissões de hub.
- **AZA8_SUPPORT** (HUB): `HUB_DASHBOARD_VIEW`, `HUB_TENANT_READ`, `HUB_TENANT_USERS_READ`, `HUB_AUDIT_READ`.
- **AZA8_ACCOUNT_MANAGER** (HUB): `HUB_DASHBOARD_VIEW`, `HUB_TENANT_READ`, `HUB_TENANT_WRITE`, `HUB_TENANT_USERS_READ`, `HUB_TOOLS_MANAGE`, `HUB_AUDIT_READ`.
- **OWNER** (PORTAL): todas as permissões de portal e ferramentas, incluindo billing, invites e role update.
- **MANAGER** (PORTAL): todas de portal exceto billing e role update; todas de ferramentas exceto approve de requests.
- **MEMBER** (PORTAL): dashboard portal + tasks/files (ler/escrever), requests (ler/criar), reports (ler). Sem gestão de time ou billing.
- **SUPPLIER** (PORTAL): files (ler/escrever), requests (ler). Sem tasks, reports ou gestão de time.

## Gestão de papéis do Hub
- Página `/hub/rbac` (perm: `HUB_RBAC_VIEW`) lista papéis do Hub e permite criar/editar/arquivar.
- Criação/edição: definir nome, descrição e selecionar permissões de hub (dashboard, tenants read/write, tenant users read/write, tools manage, rbac view, audit read). Mensagem de sucesso “Papel salvo” e erro “Não foi possível salvar o papel”.
- Arquivamento: bloqueia se papel estiver associado a usuários ativos; alerta “Remova o papel dos usuários antes de arquivar”.
- Atribuição: interface de associação papel→usuário do hub; feedback “Papel atribuído/removido” ou “Erro ao atualizar atribuições”.
- Mensagem de acesso negado: “Acesso restrito ao Hub” quando usuário não possui `HUB_RBAC_VIEW`.

## Escopos
- Hub: permissões aplicadas no contexto `isHubRequest=true`, sem tenantId.
- Portal: permissões aplicadas no contexto do tenant ativo; usuário precisa de membership e role do portal.
- Tools: dependem de `toolKey` instalado no tenant; se ausente, frontend exibe “Tool not installed” e backend pode responder 404/403 conforme guard.

## Seeds determinísticos
- Tenants: `alpha`, `beta`.
- Hub users: `aza8_admin@aza8.com` (AZA8_ADMIN), `aza8_support@aza8.com` (AZA8_SUPPORT).
- Portal users:
  - Alpha: owner/manager/member/supplier.
  - Beta: owner/member.
- Ferramentas instaladas: alpha (tasks/files/requests/reports); beta (tasks/reports habilitadas, files/requests desabilitadas).

## Regras de enforcement
- Backend: decorator `@RequirePermissions(...)` + `PermissionsGuard` leem `userContext.permissions` (fonte: Role→Permission em banco). Hub sempre checa role de hub; portal exige membership do tenant ativo.
- Frontend: menus são filtrados pelo config de navegação (`requiredPermissions` e `toolKey`). A página também envolve `RouteGuard` que redireciona para `/403` ou mostra “Tool not installed”.
- Tenancy: Prisma middleware injeta `tenantId` em modelos escopados e bloqueia cross-tenant quando `TENANCY_ENFORCEMENT_MODE=strict`.
