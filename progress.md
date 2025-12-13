# Rollout Material Design 3 – Progresso
- Sprint: 2025.12 – Refinamento de Tenancy + UX Hub/Portal (TENANCY_ENFORCEMENT_MODE=strict)
- Objetivo: alinhar todas as páginas (Hub `/hub/*` e Portal `/app/*`) ao Material Design 3 com navegação coerente e isolamento de tenant.

## Tarefas prioritárias (ordem de execução)
- [ ] Criar página de teste layout(pública) para definir o Navigation–Body–AppBar para entender a estrura.
- [ ] refazer a página de Design System (pública) exibindo tokens MD3 e referências.
- [ ] Consolidar tokens de tema (cores, tipografia, shape, elevation, states) no código e em `docs/design-system.md`.
- [ ] Padronizar componentes base MD3 (Botões, FAB, TextField, Select, Card, Dialog, Snackbar, Tabs, Chips).
- [ ] Ajustar navegação Hub (`/hub/*`) e Portal (`/app/*`) para App Bar + Navigation Drawer/Rail MD3 com fallback "Tool not installed".
- [ ] Aplicar templates MD3 nas páginas críticas (login, dashboard, tools*, settings*, audit) respeitando TenantContext e guards de RBAC.
- [ ] Revisar motion/acessibilidade (focus visible, contraste, transições) conforme M3.

## Checklist por domínio
**Tema e tokens**
- [ ] Cores primárias/secundárias/tonais + surface containers (light/dark)
- [ ] Tipografia MD3 (display, headline, title, label, body) mapeada para tokens
- [ ] Shape/densidade (radius, espaçamentos, touch targets)
- [ ] Elevação/sombras e states (hover/pressed/focus/disabled)

**Componentes base**
- [ ] Buttons (filled, tonal, outlined, text) + ícones
- [ ] FAB/CTA flutuantes
- [ ] TextField/Select (filled) + helper/error
- [ ] Cards (outlined/tonal) + lists/dividers
- [ ] Dialog/Sheet/Snackbar + actions
- [ ] Navigation (Top App Bar, Drawer/Rail, Tabs) com ícones `material-symbols-rounded`

**Navegação Hub vs Portal**
- [ ] Hub (`hub.localhost`): menus administrativos em `/hub/*`
- [ ] Portal (`{tenant}.localhost`): menus operacionais em `/app/*`
- [ ] Fallback "Tool not installed" quando `toolKey` ausente em `ToolInstall`
- [ ] Guards: `RouteGuard`, `navigation.config.ts` revisados
- [ ] Propagação `TenantContext` em middleware/serviços

**Páginas a reformular**
- [ ] `/login` (pública)
- [ ] `/dashboard` (Portal)
- [ ] `/tools/tasks`, `/tools/files`, `/tools/requests`, `/tools/reports` (Portal)
- [ ] `/team/members`, `/team/invitations` (Portal)
- [ ] `/settings/profile`, `/settings/organization`, `/settings/billing` (Portal)
- [ ] `/audit` (Portal)
- [ ] `/hub/dashboard`, `/hub/tenants`, `/hub/tenants/new`, `/hub/rbac/*`, `/hub/audit`

**Docs e rastreio**
- [ ] Sincronizar `docs/design-system.md` com tokens/componentes usados
- [ ] Atualizar `docs/pages.md` e `docs/platform-overview.md` quando alterar rotas/menus
- [ ] Ajustar `docs/tenancy.md` se alterar fluxo de tenant/guards
- [ ] Ajustar `docs/rbac.md` se alterar roles/permissões/guards
- [ ] Registrar passos no `.codex/agent.log`

## Notas de implementação
- Manter coerência entre Hub/Portal; variações só se o design system permitir.
- Componentes devem expor estados MD3 e suportar temas claro/escuro.
- Evitar endpoints sem tenant context quando envolver dados; páginas públicas devem ser estáticas.
