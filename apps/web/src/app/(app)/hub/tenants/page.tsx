import { PagePanel } from '@components/PagePanel';

export default function HubTenantsPage() {
  return (
    <div className="space-y-4" data-testid="hub-tenants-page">
      <PagePanel
        title="Hub — Tenants"
        description="Gestão multiempresa com isolamento estrito entre tenants."
        icon="lan"
        helper="Hub · RBAC"
        testId="hub-tenants-panel"
      >
        <p className="text-xs text-[#49454F]">Permissão: HUB_TENANT_READ.</p>
      </PagePanel>
    </div>
  );
}
