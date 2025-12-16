# Mapa de Implementação – Aza8 Hub MVP

## Visão geral de camadas
- **web (Next.js, App Router)**: único app que serve Hub (`/hub/*`) e Portal (rotas raiz: `/dashboard`, `/tools/*`, `/team/*`, `/settings/*`, `/audit`) respeitando o host para resolver tenant. Usa config de navegação tipada para menu e guarda de rota (permissões + ferramenta instalada). Consome API via fetch com sessão em cookie httpOnly.
- **api (NestJS + Prisma)**: serviços REST com guardas de autenticação/permissão, middleware de tenancy e repositories que sempre recebem `tenantId` do contexto. Seeds determinísticos criam tenants, usuários, roles/permissions, installs de ferramentas e dados iniciais das ferramentas.
- **shared (packages)**: tipos, enums e constantes (roles, permissions, tool keys, nav config), helpers de tenant/host, cliente de auth para web, presets de tsconfig/eslint.

## web (apps/web)
- `app/(public)`: `/` (redirect para dashboard), `/login`, `/design-system`, `/layout-lab`, `/403`.
- `app/hub/*`: dashboard, tenants list/new, RBAC, audit.
- `app/(app)/*` (portal, sem prefixo `/app` na URL): dashboard, tools (tasks/files/requests/reports), team (members/invitations), settings (profile/organization/billing), audit.
- `app/layout.tsx`: AppShell com header + sidebar gerada do `navigation.config`.
- `app/_components/navigation.tsx`: render do menu usando `navConfig`.
- `app/_components/route-guard.tsx`: wrapper que avalia permissões requeridas + feature/tool instalada; redireciona para `/403` ou mostra “Tool not installed”.
- `app/_lib/api.ts`: cliente fetch simples que envia cookies e trata erros.
- `app/_lib/navigation.config.ts`: fonte única de truth para sidebar (label, path, requiredPermissions, toolKey, featureFlag).
- `app/_lib/permissions.ts`: helpers para checar permissões no client.
- `app/_lib/tenant.ts`: resolve tenant do host para exibir contexto.
- `app/_components/state-blocks.tsx`: loading/empty/error blocks padronizados.
- `app/(...)/page.tsx`: cada rota com título, descrição, lista de permissões, data-testid estáveis, estados vazios/carregando/erro e forms mínimos chamando API.

## api (apps/api-core)
- `prisma/schema.prisma`: modelos Tenant, User, Membership, Role, Permission, RolePermission, Tool, ToolInstall, Invite, AuditLog, Task, FileItem, RequestItem. Enums para RoleScope (`HUB`|`PORTAL`) e tipos de usuário (`HUB`|`PORTAL`).
- `prisma/seed.ts`: seeds determinísticos (IDs fixos) para tenants alpha/beta, usuários/roles/memberships, ferramentas instaladas, tasks/files/requests, invites e role→permission mapping.
- `src/main.ts`: habilita cookie parser, global pipes/filters/interceptors.
- `src/config`: inclui flags de enforcement (`strict`), porta etc.
- `src/tenancy`: middleware resolve tenant por host, `TenantContextStore` com `AsyncLocalStorage`, `PrismaService` middleware injeta `tenantId` em modelos escopados (Task, FileItem, RequestItem, Invite, AuditLog, ToolInstall, Membership).
- `src/auth`: session service (cookie httpOnly), guard que carrega usuário, membership do tenant atual e permissões calculadas pelo mapping; endpoints `/auth/login`, `/auth/logout`, `/auth/me`.
- `src/rbac`: `@RequirePermissions` decorator, `PermissionsGuard` (usa `userContext.permissions`), service para resolver permissões por role.
- `src/hub`: controllers/services para tenants (list/create/detail), tools install toggle, audit view.
- `src/portal`: controllers/services para members (list/update role), invites (create/accept), tools data (tasks/files/requests/reports), audit view, settings/profile/org/billing placeholders.
- `src/common`: DTOs, interceptors de audit logging, exceptions.
- `src/core/repositories`: camada fina para cada agregado (TasksRepository, FilesRepository, RequestsRepository, ToolInstallRepository etc.) que sempre exigem `tenantId`.

## shared (packages)
- `packages/core-domain`: enums constantes (`Roles`, `Permissions`, `RolePermissionMatrix`, `ToolKeys`), tipos de TenantContext, helper `extractTenantSlugFromHost` e flags de feature.
- `packages/auth-client`: hooks/client para `/auth/me`, login/logout com fetch, exposição de `useSession`.
- `packages/config`: runtime config shared (API base URL, app name).
- `packages/ui`: componentes básicos (AppShell, Table simples, Button/Input).

## Testes E2E (apps/web/playwright)
- Playwright ainda não está configurado no repo; cenários acima são planejados.
- Fixtures recomendadas: login helper (mock login via `/api/auth/mock-login`, que chama `/auth/login` na API core e aplica cookie), host resolver (hub vs `{slug}.localhost`).
- Cenários planejados: OWNER alpha (menus completos, billing, invites, CRUD tasks/files/requests + approve), MEMBER alpha (sem team/billing, billing 403, requests sem approve), SUPPLIER alpha (somente ferramentas permitidas, tasks 403), MEMBER beta (tasks+reports apenas, files => “Tool not installed”), isolamento de tenant (dados beta não acessíveis a alpha).

## Fluxo de execução
1) `pnpm install && pnpm prisma:generate && pnpm --filter @aza8/api-core prisma db push && pnpm --filter @aza8/api-core prisma db seed`.
2) `pnpm --filter @aza8/api-core dev` (porta 3001) e `pnpm --filter @aza8/web dev` (porta 3000) com hosts `hub.localhost`/`alpha.localhost`/`beta.localhost`.
3) Playwright: pendente de configuração (`apps/web/playwright.config.ts` inexistente); após criar, executar `pnpm --filter @aza8/web test:e2e`.

## Revisão v0.1.1 – 2025-12-15
- Autor: Codex (AI)
- Escopo: corrigir paths (portal sem `/app`, login em `/login`), ajustar rotas públicas reais e status dos testes e2e.
- Impacto: documentação reflete navegação atual; reduz risco de QA apontar para rotas inexistentes ou rodar testes inexistentes.
- Fontes MCP: não utilizado.
