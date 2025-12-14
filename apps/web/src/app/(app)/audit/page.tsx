import { PagePanel } from '@components/PagePanel';

export default function AuditPage() {
  return (
    <div className="space-y-4" data-testid="audit-page">
      <PagePanel
        title="Audit"
        description="Trilhas e eventos críticos do tenant renderizados dentro do Navigation–Body–App Bar."
        icon="rule"
        helper="Observabilidade · RBAC"
        testId="audit-panel"
      >
        <p className="text-xs text-[#49454F]">Permissão: AUDIT_READ.</p>
      </PagePanel>
    </div>
  );
}
