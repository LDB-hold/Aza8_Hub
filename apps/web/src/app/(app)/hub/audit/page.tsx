import { PagePanel } from '@components/PagePanel';

export default function HubAuditPage() {
  return (
    <div className="space-y-4" data-testid="hub-audit-page">
      <PagePanel
        title="Hub — Audit"
        description="Eventos críticos do hub com fallback de RBAC aplicado no layout unificado."
        icon="rule_settings"
        helper="Hub · Observabilidade"
        testId="hub-audit-panel"
      >
        <p className="text-xs text-[#49454F]">Permissão: HUB_AUDIT_READ.</p>
      </PagePanel>
    </div>
  );
}
