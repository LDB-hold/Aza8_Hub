import { PagePanel } from '@components/PagePanel';

export default function HubTenantsNewPage() {
  return (
    <div className="space-y-4" data-testid="hub-tenants-new-page">
      <PagePanel
        title="Hub — Novo Tenant"
        description="Crie tenants respeitando TENANCY_ENFORCEMENT_MODE=strict e o layout unificado."
        icon="add_business"
        helper="Hub · RBAC"
        testId="hub-tenants-new-panel"
      >
        <p className="text-xs text-[#49454F]">Permissão: HUB_TENANT_WRITE.</p>
      </PagePanel>
    </div>
  );
}
