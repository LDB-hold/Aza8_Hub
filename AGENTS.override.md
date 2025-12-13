# AGENTS.override.md
### Aza8 Hub Architect – Overrides Temporários de Sprint
> ⚠️ Este arquivo **tem precedência sobre `AGENTS.md`**.  
> Use-o para instruções de curto prazo, revisões de comportamento ou hotfixes.  
> Remova ou renomeie após o ciclo de sprint para restaurar o comportamento padrão.

## 🎯 Contexto da Sprint Atual
- **Sprint:** 2025.12 – _Refinamento de Tenancy + UX Hub/Portal_
- **Objetivo:** reforçar coerência de navegação e isolamento de tenants durante revisões de RBAC e testes e2e.
- **Status:** ativo até 20/12/2025.

## 🧭 Regras Temporárias de Execução

### 1. Priorizar revisões de tenancy
Antes de qualquer proposta de alteração de schema, serviço ou rota:
- Validar sempre `TENANCY_ENFORCEMENT_MODE=strict`.
- Garantir que `TenantContext` está sendo propagado no middleware.
- Proibir criação de endpoints sem tenant context explícito.
> **Docs base:** `docs/tenancy.md`, `docs/architecture-base.md`.

### 2. Auditoria reforçada de RBAC
Durante esta sprint, toda alteração de role ou permission deve:
- Ser registrada no log de agente (`.codex/agent.log`).
- Incluir um diff visível em `docs/rbac.md`.
- Revalidar guards de frontend (`RouteGuard`, `navigation.config.ts`).
> **Docs base:** `docs/rbac.md`, `docs/pages.md`.

### 3. Sincronização de documentação obrigatória
| Tipo | Documento | Exemplo |
|------|------------|---------|
| Rota / menu | `docs/pages.md` | `/hub/tools` ou `/app/settings/*` |
| Permissões / roles | `docs/rbac.md` | `MANAGER` → sem acesso billing |
| Tenancy / isolamento | `docs/tenancy.md` | `TenantContextService` atualizado |
| UX / navegação | `docs/platform-overview.md` | Menus do Hub revisados |

### 4. Logging ampliado
Durante a execução de tarefas nesta sprint:
- Cada ação deve gerar um bloco JSON no `.codex/agent.log` com:
  ```json
  {
    "timestamp": "2025-12-12T15:42:00Z",
    "task": "validate RBAC guard /hub/audit",
    "mcp": "context7",
    "docs": ["docs/rbac.md", "docs/pages.md"],
    "designDoc": "https://m3.material.io/styles"
    "result": "OK"
  }
  ```
- Logs devem ser mantidos por 30 dias.

### 5. Controle de UX Hub vs Portal
Durante este ciclo:
- Validar que menus e tool keys estão **consistentes entre hosts**:  
  - `hub.localhost` → `/hub/*` menus administrativos  
  - `{tenant}.localhost` → `/app/*` menus operacionais  
- “Tool not installed” deve ser exibido sempre que `toolKey` não estiver em `ToolInstall`.
> **Fonte:** `packages/core-domain`, `apps/web/app/_components/navigation.tsx`

### 9. Conformidade Material Design 3
- Qualquer ajuste de UX, menus ou componentes deve citar explicitamente a página consultada em https://m3.material.io.
- Divergências entre Hub (`/hub/*`) e Portal (`/app/*`) só são aceitas se o design system permitir variação por contexto.
- Atualize `docs/design-system.md` com tokens e componentes utilizados para cada mudança.

### 10. Execução guiada por progress.md
- Antes de iniciar qualquer tarefa, consultar `progress.md` para identificar a próxima etapa a executar.
- Ao concluir uma etapa listada no `progress.md`, remover essa entrada da lista (não apenas marcar), mantendo o arquivo como fonte da próxima ação.
- Operar sempre em pt-BR ao registrar ou ajustar o `progress.md`, respeitando as regras desta sprint.

### 6. Autorização manual obrigatória
Qualquer ação que altere:
- Dados persistentes (DB/Prisma),
- Roles/permissões,
- Seeds determinísticos,  
**deve requerer aprovação explícita** antes da execução (`approval_policy = manual-destructive`).

### 7. Diretriz Material Design 3 – Hub “como o site do Material Design 3”
- Adotar arquitetura **Navigation – Body – App Bar** em todas as páginas (Hub/Portal), usando componentes M3 para Top App Bar + Navigation Drawer/Rail + conteúdo principal.
- Aplicar **theme dinâmico por tenant** (palette/tonal + dark/light) respeitando tokens MD3; quedas para default só com justificativa em `docs/design-system.md`.
- Manter **grid M3 consistente** (espacamentos, breakpoints e touch targets) nas templates; evitar variações ad-hoc entre Hub e Portal.
- Toda a plataforma deve respeitar **100% da largura disponível da viewport**, alinhando-se ao [Responsive layout grid – MD3](https://m3.material.io/foundations/layout/applying-layout/overview) que orienta superfícies fluidas.
- Navegação deve refletir o design system com estados hover/focus/pressed; App Bar sempre com breadcrumbs/ações principais e título coerente.
- Sincronizar alterações de layout/tema/navegação em `docs/design-system.md` e `progress.md`; citar página consultada em https://m3.material.io em cada ajuste.

### 11. Reset de design M3
- Desconsiderar qualquer layout/estilo legado e reconstruir as telas do Hub e do Portal do **zero** seguindo exclusivamente o Material Design 3.
- Tomar como base primária https://m3.material.io/styles (e seções específicas consultadas), registrando referências usadas em `docs/design-system.md` e `progress.md`.
- Reaplicar arquitetura Navigation – Body – App Bar, tokens e componentes MD3 (App Bar, Drawer/Rail, Navigation Tabs, states) antes de qualquer herança de UI pré-existente.

### 8. Encerramento da sprint
- Após 20/12/2025, este arquivo deve ser removido ou renomeado para `AGENTS.override.archive.md`.
- As alterações permanentes devem ser migradas para o `AGENTS.md`.

### 🧩 Resumo
Este override adiciona:
- **Reforço de validações de tenancy e RBAC**  
- **Obrigatoriedade de sincronização de docs**  
- **Logging ampliado em `.codex/agent.log`**  
- **Aprovação manual para execuções destrutivas**  
- **Controle de UX e menus entre Hub e Portal**
- **Execução guiada pelo `progress.md` (consultar e remover etapas concluídas)**
- **Respostas do agente sempre em português (pt-BR)**
