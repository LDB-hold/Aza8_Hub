# Páginas e permissões (estado atual – apps/web)

Todas as páginas autenticadas agora seguem o layout Navigation–Body–App Bar (Material Design 3) com Navigation Rail tonal + Top App Bar sticky. A navegação filtra itens por `requiredPermissions`, `toolKey` instalado e host (hub vs portal); o guard exibe “Tool not installed” ou 403 (host/permissão) quando necessário.
- Top App Bar: busca expandível + menu de perfil (botão estilo `/layout-lab`) abre menu vertical com divider, exibindo nome/e-mail e logout conforme Menus + Divider (MD3).

## Hosts
- Hub: `hub.localhost` (ou `hub.aza8.com.br` em produção)
- Portal: `{slug}.localhost` (ou `{slug}.aza8.com.br`)

## Feedbacks e erros do Hub
- Sucesso: criação/edição de tenant, atribuição de papel e exportação de audit exibem toast/snackbar “Salvo com sucesso” com ação “Ver detalhes”.
- Erros operacionais: salvar/pausar/arquivar tenant, salvar papel ou exportar audit exibem snackbar “Falha ao salvar/exportar” com ação “Tentar novamente”.
- Bloqueios de permissão/host: 403 mostra “Acesso restrito ao Hub” e sugere contato com admin; host errado exibe “Acesse via hub.localhost ou {slug}.localhost”.
- Estados vazios: listas retornam “Nenhum item encontrado” com sugestão de ajustar filtros; cards de métricas mostram “Erro ao carregar” com ação “Recarregar”.

## Público
- `/` – redireciona para `/dashboard` ou `/hub/dashboard` conforme host (`{slug}.localhost` vs `hub.localhost`).
- `/login` – login mock por e-mail seed; chama `/api/auth/mock-login` (que aciona `/auth/login` na API core) e cria cookie httpOnly. Botões flutuantes: dark mode (lua/sol) e seletor de idioma ENG/ES/BR. UI MD3 com card centralizado.
- `/design-system` – referência de tokens/MD3.
- `/layout-lab` – demonstração Navigation–Body–App Bar.
- `/403` – erro de permissão/host.
- Logout: feito via botão que chama `POST /api/auth/logout` e redireciona para `/login` (não existe rota `/logout`).

## Portal (host `{tenant}.localhost`)
- Estado atual: telas exibem PagePanel MD3 com permissão/toolKey requerida; guardas e navegação filtram por `requiredPermissions` + `toolKey`. Fluxos CRUD/listas ainda não estão implementados.
- `/dashboard` (perm: `PORTAL_DASHBOARD_VIEW`) – métricas mock e atalhos para ferramentas.
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
- Navigation rail e app bar aplicados a todas as rotas; nav item só aparece se `requiredPermissions` estiver presente e a ferramenta estiver instalada (alpha: tasks/files/requests/reports; beta: tasks/reports). Guardas exibem “Tool not installed” ou 403 de permissão/host conforme o caso.

## Hub (host `hub.localhost`)
- Estado atual: telas exibem PagePanel MD3 com permissão requerida; funcionalidades avançadas (filtros, CRUD, métricas, exportações) ainda não foram implementadas. Não há rotas `/hub/tenants/:tenantId` ou `/hub/tenants/:tenantId/edit` no código.
- `/hub/dashboard` (perm: `HUB_DASHBOARD_VIEW`) — painel informativo com contexto do Hub.
- `/hub/tenants` (perm: `HUB_TENANT_READ`) — painel com nota de permissão.
- `/hub/tenants/new` (perm: `HUB_TENANT_WRITE`) — painel com nota de permissão.
- `/hub/rbac` (perm: `HUB_RBAC_VIEW`) — painel com nota de permissão.
- `/hub/audit` (perm: `HUB_AUDIT_READ`) — painel com nota de permissão.
- Navigation rail do Hub: ordem `Dashboard`, `Tenants`, `RBAC`, `Audit`; visibilidade controlada por `requiredPermissions` (HUB_DASHBOARD_VIEW, HUB_TENANT_READ, HUB_RBAC_VIEW, HUB_AUDIT_READ). Rotas de portal são bloqueadas por host guard com mensagem “Acesse via {slug}.localhost” e botão “Ir para portal”.

## Revisão v0.1.1 – 2025-12-15
- Autor: Codex (AI)
- Escopo: alinhar rotas reais (portal sem prefixo `/app`, login em `/login`), retirar rotas inexistentes e refletir estado atual (PagePanel + guardas).
- Impacto: QA e navegação evitam 404/rotas inexistentes; guardas e links seguem paths reais; logout via API.
- Fontes MCP: não utilizado.
