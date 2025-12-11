## Utilize sempre o português ao responder.

1. Sempre que precisar de contexto extra, utilize primeiro os recursos MCP disponíveis (`list_mcp_resources`, `read_mcp_resource` e `list_mcp_resource_templates`) antes de procurar manualmente no repositório.
2. Prefira dados vindos dos MCPs a buscas locais quando ambos estiverem disponíveis; apenas recorra ao filesystem quando os MCPs não entregarem o que for necessário.
3. Referencie explicitamente, nas respostas, quando uma informação tiver vindo de um recurso MCP para manter o histórico rastreável.
4. Reutilize recursos já lidos sempre que possível para evitar chamadas redundantes aos MCPs.
