# Status da revisão do `PrismaService`

Os pontos abaixo já estão endereçados no código atual e servem como referência para evitar regressões:

1. **Enforcement em modo estrito:** o middleware bloqueia operações quando o `TenantContext` está ausente ou sem `tenantId` em `TENANCY_ENFORCEMENT_MODE=strict`, garantindo isolamento obrigatório.
2. **Preservação de payloads:** `applyTenantIdToData` lança erro se `data` estiver ausente/nulo em gravações tenant-scoped, evitando descartar campos enviados.
3. **Tipagem explícita:** `tenancyMiddleware` tipa `params` como `Prisma.MiddlewareParams` e `next` como função de middleware, garantindo autocompletar e validação de contratos do Prisma.

Caso surjam novos gaps, registre-os aqui ou remova este arquivo se deixar de ser necessário para o fluxo de revisão.
