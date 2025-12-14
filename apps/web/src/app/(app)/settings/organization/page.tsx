import { PagePanel } from '@components/PagePanel';

export default function OrganizationSettingsPage() {
  return (
    <div className="space-y-4" data-testid="settings-organization-page">
      <PagePanel
        title="Settings — Organization"
        description="Informações do cliente e contexto operacional com Navigation–Body–App Bar."
        icon="business"
        helper="Configurações · RBAC"
        testId="settings-organization-panel"
      >
        <p className="text-xs text-[#49454F]">Permissão: TENANT_SETTINGS_READ.</p>
      </PagePanel>
    </div>
  );
}
