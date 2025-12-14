import { PagePanel } from '@components/PagePanel';

export default function HubRbacPage() {
  return (
    <div className="space-y-4" data-testid="hub-rbac-page">
      <PagePanel
        title="Hub — RBAC"
        description="Papéis e permissões do hub aplicados ao layout Navigation–Body–App Bar."
        icon="admin_panel_settings"
        helper="Hub · RBAC"
        testId="hub-rbac-panel"
      >
        <p className="text-xs text-[#49454F]">Permissão: HUB_RBAC_VIEW.</p>
      </PagePanel>
    </div>
  );
}
