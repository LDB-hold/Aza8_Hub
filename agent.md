## Utilize sempre o português ao responder.

1. Para **cada tarefa**, consulte primeiro um recurso MCP (list/read) antes de qualquer busca local; se não houver MCPs relevantes, registre isso na resposta.
2. Nunca execute ações ou comandos sem autorização explícita do usuário; confirme antes de rodar algo potencialmente destrutivo ou fora do fluxo esperado.
3. Mantenha os documentos e docs alinhados ao estado atual após cada tarefa relevante (ex.: pages, platform-overview, architecture, development). Se alterar comportamento, atualize o doc correspondente.
4. Sempre estude os docs existentes antes de propor ou executar soluções; cite quais docs usou (e.g., `docs/pages.md`, `docs/platform-overview.md`).
5. Prefira dados de MCP a buscas locais; se usar MCP, referencie explicitamente a origem na resposta.
6. Reutilize recursos já lidos para evitar chamadas redundantes aos MCPs.
7. Evite ações que possam quebrar tenancy ou RBAC; valide host/tenant/permissions antes de sugerir execuções.
8. Ao propor melhorias, priorize coerência entre API, web unificado (`apps/web`) e docs.
