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
- `/` – redireciona para `/dashboard`.
- `/login` – login rápido (mock) por e-mail seed; cria cookie httpOnly e oferece par de botões flutuantes no canto inferior direito: dark mode (troca ícone lua/sol) e seletor de idioma ENG/ES/BR. UI segue Material Design 3 com um único card centralizado (text fields filled + helper sobre seeds).
- `/logout` – limpa sessão.
- `/403`, `/404`, `/500` – páginas de erro.

## Portal (host `{tenant}.localhost`)
- `/dashboard` (perm: `PORTAL_DASHBOARD_VIEW`) – visão MD3 com menu lateral SAP (navigation rail), métricas e cards de ferramentas instaladas/estado.
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
- Navigation rail e app bar aplicados a todas as rotas; nav item só aparece se `requiredPermissions` estiver presente e a ferramenta estiver instalada (alpha: tasks/files/requests/reports; beta: tasks/reports).

## Hub (host `hub.localhost`)
- `/hub/dashboard` (perm: `HUB_DASHBOARD_VIEW`) — visão executiva do hub, Navigation–Body–App Bar MD3. Conteúdo:
  - Blocos de métricas (cards tonal): Tenants ativos (ex.: 2 – alpha/beta), Ferramentas instaladas (alpha: tasks/files/requests/reports; beta: tasks/reports), Usuários do hub (2), Convites pendentes (0), Incidentes abertos (dados do audit), Saúde dos serviços (API/Web/DB) com status chip.
  - Alertas operacionais (card de destaque): falha de seed, degradação de API, erros 5xx recentes, falha de webhook, incidentes de RLS/tenancy (TENANCY_ENFORCEMENT_MODE!=strict). Permite “Ver audit” e “Ver tenants afetados”.
  - Atalhos rápidos (chips): “Criar tenant”, “Gerir RBAC”, “Ver auditoria”, “Configurar ferramentas”. Bloqueados por permissão/host com mensagens 403 ou “Tool not installed” quando a ferramenta alvo não está habilitada para o tenant.
  - Estados vazios: sem alertas → mensagem “Nenhum alerta ativo agora”; sem métricas por erro de API → card com “Erro ao carregar métricas do hub. Tente novamente” e ação “Recarregar”.
  - Erros: 403 (sem permissão) exibe “Acesso restrito ao Hub”, 404 se rota inválida, 500 com contato de suporte e link para audit.
- `/hub/tenants` (perm: `HUB_TENANT_READ`) — lista com filtros avançados e ações rápidas:
  - Filtros: Status (ativo/pausado/arquivado), Plano (Free/Pro/Enterprise), Região (us-east-1, sa-east-1), Data de criação (intervalo), Uso (quota >/<), Ferramentas instaladas (tasks/files/requests/reports).
  - Colunas: Tenant (nome + slug), Plano, Região, Saúde (chip: saudável/degradado/incidente), Uso (ex.: tasks abertas, storage usado), Ferramentas instaladas, Status (ativo/pausado/arquivado), Última atividade.
  - Ações rápidas por linha: Pausar/Retomar, Arquivar, Ver detalhes, Gerir ferramentas, Ver audit do tenant.
  - Feedbacks: toast “Tenant pausado/retomado/arquivado”, erro com mensagem “Falha ao atualizar status do tenant” e ação “Tentar novamente”. Estado vazio: “Nenhum tenant encontrado com estes filtros”.
  - Erros: 403 se usuário não tem permissão de leitura, 500 com instrução de contatar suporte e link para audit.
- `/hub/tenants/new` (perm: `HUB_TENANT_WRITE`) — formulário guiado:
  - Identificação: Nome do tenant, Slug/domínio (`{slug}.aza8.com.br`), Descrição curta.
  - Contato: Nome do contato, E-mail, Telefone (opcional), Time responsável interno (ex.: Account Management).
  - Plano/Billing: Plano (Free/Pro/Enterprise), Ciclo (mensal/anual), Método de cobrança (cartão/fatura), Data de início, Centro de custo.
  - Região/Isolamento: Região (us-east-1, sa-east-1), Isolamento de dados (padrão/estrito) conforme `docs/tenancy.md`.
  - Limites de uso: Tarefas (limite), Storage (GB), Requests (mensal), Relatórios (mês). Mensagens de validação quando limites ausentes ou inconsistentes.
  - Status/Lifecycle: Estado inicial (ativo/pausado), Motivo (se pausado), Data de ativação prevista.
  - Tags/Notas internas: etiquetas livres e campo de notas de operação.
  - Mensagens de ajuda: exemplos reais usando seeds alpha/beta; validação de slug com regex e erro “Slug já em uso”.
- `/hub/tenants/:tenantId/edit` (perm: `HUB_TENANT_WRITE`) — reutiliza campos de criação; bloqueia alteração de slug/domínio se houver ferramentas instaladas ou billing ativo; mostra aviso “Altere billing ou tools com cautela; afeta acesso do portal”.
- `/hub/tenants/:tenantId` (perm: `HUB_TENANT_READ`) — ver detalhes completos do tenant:
  - Overview: nome/slug, plano, região, saúde, status (ativo/pausado/arquivado), limites de uso e consumo atual.
  - Ferramentas instaladas: tasks/files/requests/reports com estado (ativo/desativado) e ação “Gerir ferramenta”.
  - Chaves/segredos: credenciais do tenant (somente leitura), com aviso de confidencialidade e ações de copiar/rotacionar.
  - Domínios: `{slug}.aza8.com.br` e custom domains (se houver), com estado de verificação e mensagem “Tool not installed” se ferramenta depender de domínio.
  - Webhooks: URL, segredo, eventos habilitados, status de entrega e último erro; ação de reenviar evento teste.
  - SLAs: plano de SLA associado, tempo de resposta e disponibilidade alvo.
  - Histórico de ações: feed auditável com ator, ação, recurso e timestamp; link para `/hub/audit` filtrado pelo tenant.
  - Mensagens: 403 se usuário não pode ver detalhes; 404 se tenant não existe; 500 se falha ao carregar blocos (com “Recarregar”).
- `/hub/rbac` (perm: `HUB_RBAC_VIEW`) — catálogo de papéis/permissões do Hub:
  - Lista de papéis (AZA8_ADMIN, AZA8_SUPPORT, AZA8_ACCOUNT_MANAGER) com colunas: Descrição, Escopo (Hub), Permissões associadas, Última alteração.
  - Ações: Criar papel (HUB), Editar (alterar descrição e permissões), Duplicar papel, Revogar/arquivar papel (bloqueia se em uso).
  - Permissões disponíveis: HUB_DASHBOARD_VIEW, HUB_TENANT_READ/WRITE, HUB_TENANT_USERS_READ/WRITE, HUB_TOOLS_MANAGE, HUB_RBAC_VIEW, HUB_AUDIT_READ.
  - Atribuição: associar papéis a usuários de hub (lista seed); mensagem “Papel atribuído/removido” e erro “Não foi possível atualizar as atribuições”.
  - Mensagens: 403 se usuário não tem acesso; feedback “Papel criado/atualizado/arquivado com sucesso”; erro “Não foi possível salvar o papel” com ação “Tentar novamente”.
- `/hub/audit` (perm: `HUB_AUDIT_READ`) — trilha de auditoria do hub:
  - Filtros: Tempo (hoje/7d/30d/custom), Ator (user/e-mail), Recurso (tenant/tool/rbac/audit), Ação (create/update/delete/activate/pause/archive), Tenant (alpha/beta).
  - Lista de eventos: timestamp, ator, recurso, ação, tenant, resultado (sucesso/falha), metadata (ex.: slug alterado).
  - Detalhe do item: resumo, payload (somente leitura), status de entrega de webhook (se aplicável), links para tenant/rbac/tool relacionados.
  - Exportação: CSV/JSON (limitado a período selecionado) e ação “Copiar link filtrado”.
  - Estados: vazio (“Nenhum evento para os filtros atuais”), erro 500 (“Erro ao carregar auditoria. Recarregar”).
- Navigation rail do Hub: ordem `Dashboard`, `Tenants`, `RBAC`, `Audit`; visibilidade controlada por `requiredPermissions` (HUB_DASHBOARD_VIEW, HUB_TENANT_READ, HUB_RBAC_VIEW, HUB_AUDIT_READ). Rotas de portal são bloqueadas por host guard com mensagem “Acesse via {slug}.localhost” e botão “Ir para portal”.
- Feedbacks globais do Hub: toasts de sucesso para criar/editar tenant, atribuir papel e exportar audit; erros exibem snackbar “Falha ao salvar” com ação “Tentar novamente”; estados vazios seguem MD3 (“Nenhum item encontrado”).
- Páginas de erro (Hub): 403 (“Acesso restrito ao Hub”), 404 (“Página do Hub não encontrada”) e 500 (“Erro ao carregar o Hub. Tente novamente ou contate suporte”) com ação de recarregar e link para auditoria quando autenticado.
