import { PagePanel } from '@components/PagePanel';

export default function ProfileSettingsPage() {
  return (
    <div className="space-y-4" data-testid="settings-profile-page">
      <PagePanel
        title="Settings — Profile"
        description="Atualize dados pessoais e preferências mantendo o app bar consistente."
        icon="badge"
        helper="Configurações · RBAC"
        testId="settings-profile-panel"
      >
        <p className="text-xs text-[#49454F]">Permissão: PORTAL_DASHBOARD_VIEW.</p>
      </PagePanel>
    </div>
  );
}
