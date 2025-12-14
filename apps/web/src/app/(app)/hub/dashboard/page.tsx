import { PagePanel } from '@components/PagePanel';

export default function HubDashboardPage() {
  return (
    <div className="space-y-4" data-testid="hub-dashboard-page">
      <PagePanel
        title="Hub — Dashboard"
        description="Panorama multi-tenant com Navigation–Body–App Bar."
        icon="hub"
        helper="Hub · RBAC"
        testId="hub-dashboard-panel"
      >
        <p className="text-xs text-[#49454F]">Permissão: HUB_DASHBOARD_VIEW.</p>
      </PagePanel>
    </div>
  );
}
