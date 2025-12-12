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

### 6. Autorização manual obrigatória
Qualquer ação que altere:
- Dados persistentes (DB/Prisma),
- Roles/permissões,
- Seeds determinísticos,  
**deve requerer aprovação explícita** antes da execução (`approval_policy = manual-destructive`).

### 7. Tasks temporárias da sprint
| Nº | Tarefa | Tipo | Responsável | Status |
|----|---------|------|--------------|---------|
| 01 | Revisar propagação de tenantId em todos os services do Hub | backend | Aza8 Architect | ⏳ |
| 02 | Garantir que `/app/tools/reports` respeita `TOOL_REPORTS_READ` | frontend | Aza8 Architect | ✅ |
| 03 | Atualizar `docs/platform-overview.md` com rotas novas de Hub | docs | Aza8 Architect | 🔄 |
| 04 | Validar cross-tenant no `PrismaService` (modo strict) | backend | Aza8 Architect | ⏳ |
| 05 | Revisar seeds e roles OWNER/MANAGER | seed | Aza8 Architect | ✅ |

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
