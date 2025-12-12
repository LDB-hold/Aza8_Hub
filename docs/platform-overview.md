# Aza8 Hub – Visão Geral (estado atual)

## Superfície funcional (resumo)
- Hub B2B multiempresa com portais de clientes e catálogo de ferramentas (tasks, files, requests, reports).
- Identidade e acesso: login centralizado, papéis/permissões, auditoria de mudanças.
- Tenancy por host: `hub.localhost` (hub), `{slug}.localhost` (portal); ferramentas habilitáveis por tenant.
- Operação: solicitações, entregas/approvals, arquivos/evidências, relatórios, notificações.
- Governança: trilhas de auditoria, isolamento operacional e RLS lógico via tenantId em repositórios.

## Componentes
- **API Core (`apps/api-core`)**: NestJS + Prisma/PostgreSQL; tenancy middleware; Auth/RBAC; endpoints hub (`/hub/*`) e portal (`/portal/*`); seeds determinísticos (tenants alpha/beta, users/roles, ferramentas instaladas).
- **Web unificado (`apps/web`)**: Next.js App Router servindo `/hub/*` e `/app/*`; resolve tenant pelo host; guarda de rota + menus por permissões/ferramentas instaladas; sessão em cookie.
- **Packages (`packages/*`)**: `core-domain` (roles/permissions/tool keys), `auth-client`, `config`, `ui`, presets de tsconfig/eslint.

## Hosts locais e seeds
- `/etc/hosts`:
  ```
  127.0.0.1 hub.localhost
  127.0.0.1 alpha.localhost
  127.0.0.1 beta.localhost
  ```
- Tenants seeds: `alpha`, `beta`.
- Usuários seeds: hub (`aza8_admin@aza8.com`, `aza8_support@aza8.com`); portal (owner/manager/member/supplier para alpha; owner/member para beta).
- Ferramentas instaladas: alpha (tasks/files/requests/reports), beta (tasks/reports habilitadas; files/requests desabilitadas).

## Rotas principais (docs/pages.md detalha)
- Hub: `/hub/dashboard`, `/hub/tenants`, `/hub/tenants/new`, `/hub/rbac/roles`, `/hub/audit`.
- Portal: `/app/dashboard`, `/app/tools/{tasks|files|requests|reports}`, `/app/team/{members|invitations}`, `/app/settings/{profile|organization|billing}`, `/app/audit`.

## Execução local (resumo)
1) `pnpm install && pnpm prisma:generate`
2) `pnpm --filter @aza8/api-core prisma db push && pnpm --filter @aza8/api-core prisma db seed`
3) `pnpm --filter @aza8/api-core dev` (3001) e `pnpm --filter @aza8/web dev` (3000)
4) Acessar `hub.localhost:3000` (hub) ou `{tenant}.localhost:3000` (portal)

## RBAC e tenancy
- `AuthGuard` resolve `userContext` (role/permissões) para o host atual; `PermissionsGuard` aplica `@RequirePermissions`.
- `PrismaService` injeta `tenantId` em modelos escopados (tasks, files, requests, invites, memberships, audit, tool installs) para evitar cross-tenant; `TENANCY_ENFORCEMENT_MODE` (`warn|strict`).
- Permissões e papéis detalhados em `docs/rbac.md`; navegação/guard de frontend segue essas permissões e ferramenta instalada.
