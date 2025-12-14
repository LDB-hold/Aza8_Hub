import { PagePanel } from '@components/PagePanel';

export default function ReportsPage() {
  return (
    <div className="space-y-4" data-testid="reports-page">
      <PagePanel
        title="Reports"
        description="Indicadores e visões operacionais ancorados no layout Navigation–Body–App Bar."
        icon="monitoring"
        helper="Ferramentas · RBAC"
        testId="reports-panel"
      >
        <p className="text-xs text-[#49454F]">Permissão: TOOL_REPORTS_READ. toolKey: reports.</p>
      </PagePanel>
    </div>
  );
}
