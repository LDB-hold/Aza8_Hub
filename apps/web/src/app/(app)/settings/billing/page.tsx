import { PagePanel } from '@components/PagePanel';

export default function BillingSettingsPage() {
  return (
    <div className="space-y-4" data-testid="settings-billing-page">
      <PagePanel
        title="Settings — Billing"
        description="Plano, limites e histórico de cobrança dentro do layout unificado."
        icon="receipt_long"
        helper="Configurações · RBAC"
        testId="settings-billing-panel"
      >
        <p className="text-xs text-[#49454F]">Permissão: TENANT_BILLING_READ/TENANT_BILLING_WRITE (OWNER obrigatório).</p>
      </PagePanel>
    </div>
  );
}
