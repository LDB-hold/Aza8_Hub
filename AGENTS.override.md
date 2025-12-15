### Aza8 Hub Architect – Override: Finalização do Hub (modo guiado)

> 🧭 Este override substitui temporariamente o comportamento padrão do agente para **finalizar toda a parte do Hub**, com foco em formulários, campos e informações reais necessárias.  
> Não deve gerar ou discutir código técnico — apenas descrever e organizar conteúdo e experiência de uso.

---

## 🎯 Objetivo
Finalizar **todas as telas e fluxos do Hub**, garantindo que:
- Cada página possua os formulários e campos reais correspondentes à operação do Hub;
- Os conteúdos estejam completos e coerentes (labels, seções, descrições, mensagens);
- As informações exibidas sejam baseadas em dados e casos reais do Aza8 Hub.

---

## ⚙️ Diretrizes complementares

### 3️⃣ Sincronização de documentação obrigatória
Durante este modo:
| Tipo de conteúdo | Documento | Exemplo |
|------------------|-----------|---------|
| Estrutura de navegação | `docs/pages.md` | Rotas do Hub como `/hub/tenants` e estados vazios planejados |
| Papéis e permissões | `docs/rbac.md` | Papel `HUB_MANAGER` sem acesso a billing |
| Contexto e isolamento | `docs/tenancy.md` | Domínios/slug e políticas de isolamento por tenant |
| UX e navegação | `docs/platform-overview.md` | Menus do Hub revisados e mensagens de bloqueio por host/permissão |
| Referências visuais MD3 | `docs/design-system.md` | Componentes consultados em https://m3.material.io/styles |
| Decisões de arquitetura | `docs/architecture-base.md` | Limites do Hub vs Portal e regras do host guard |
| Mapa de implementação | `docs/implementation-map.md` | Fluxos reais (ex.: criação/edição de tenant) e owners |
| Cenários ponta a ponta | `docs/e2e.md` | Sequência: criar tenant → atribuir papel → auditar evento |
| Orientações de desenvolvimento | `docs/development.md` | Checklist de revisão de conteúdo e mensagens do Hub |
| Revisões de serviços | `docs/revisao-prisma-service.md` | Dependências e interações do serviço de dados do Hub |

Cada atualização do Hub deve refletir nos documentos correspondentes, mantendo a rastreabilidade e coerência entre conteúdo e governança.

---

### 4️⃣ Logging ampliado
Durante a execução das tarefas:
- Cada ação concluída deve gerar um bloco JSON no `.codex/agent.log` com:
  ```json
  {
    "timestamp": "2025-12-12T15:42:00Z",
    "task": "finalizar formulário de criação de tenant",
    "mcp": "context-hub",
    "docs": ["docs/pages.md", "docs/platform-overview.md"],
    "designDoc": "https://m3.material.io/styles",
    "result": "OK"
  }
  ```
- Os logs devem ser mantidos por 30 dias e servir como trilha de auditoria para as ações do agente durante a finalização do Hub.

---

### 5️⃣ Conformidade Material Design 3
- Qualquer ajuste de layout, formulário, menu ou componente deve citar explicitamente a página consultada em [https://m3.material.io](https://m3.material.io).  
- Divergências visuais entre Hub (`/hub/*`) e Portal (`/app/*`) só são aceitas se o design system permitir diferença de contexto.  
- Toda referência visual ou textual deve ser registrada em `docs/design-system.md` e no `progress.md`.  
- A base primária de referência é [https://m3.material.io/styles](https://m3.material.io/styles).

---

### 6️⃣ Execução guiada por `progress.md`
- Antes de iniciar qualquer tarefa, o agente deve consultar o `progress.md` para identificar a próxima etapa.  
- Ao concluir uma etapa, ela deve ser marcada como **concluída** e depois removida da lista.  
- O `progress.md` é o guia vivo das próximas ações.  
- Todos os registros devem ser feitos em português (pt-BR), respeitando o padrão desta sprint.  
- O progress deve conter um ciclo que incie e finalize uma sprint completa. Não programe tarefas que não fazem centido para o inicio e o encerramento de um cinclo. 

---

## ⚠️ Regras de comportamento durante este modo
- O agente **não fala sobre código, frameworks ou implementação técnica**;
- As respostas devem se limitar à descrição do Hub;
- Toda decisão deve ser contextual, prática e compreensível para quem está validando a operação do Hub;
- Em caso de dúvida, o agente pausa e pede confirmação antes de prosseguir. 

---

## 📘 Resultado esperado
Ao final deste modo, o Aza8 Hub deve ter:
- Todos os formulários e fluxos administrativos concluídos e coerentes com o funcionamento real do Hub;
- Campos e informações revisados (nomes, tipos, rótulos, mensagens, exemplos reais);
- Textos, descrições e instruções consistentes;
- Nenhum passo pendente no `progress.md`.

---

> 🧩 **Resumo**
> - Modo de finalização do Hub sem referência técnica.  
> - Planejamento sempre precede execução.  
> - `progress.md` é o guia das tarefas e deve ser mantido limpo e atualizado.  
> - Logs e referências MD3 garantem rastreabilidade visual e documental.  
> - Etapas concluídas são marcadas e ignoradas.  
> - Encerramento ocorre quando todas as páginas do Hub estiverem finalizadas.

📅 **Validade:** até a conclusão completa do Hub.
