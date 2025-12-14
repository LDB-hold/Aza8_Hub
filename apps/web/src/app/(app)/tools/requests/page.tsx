import { PagePanel } from '@components/PagePanel';

export default function RequestsPage() {
  return (
    <div className="space-y-4" data-testid="requests-page">
      <PagePanel
        title="Requests"
        description="Solicitações estruturadas com aprovações seguindo o layout Navigation–Body–App Bar."
        icon="assignment"
        helper="Ferramentas · RBAC"
        testId="requests-panel"
      >
        <p className="text-xs text-[#49454F]">
          Permissões: TOOL_REQUESTS_READ (listar), TOOL_REQUESTS_CREATE (criar) e TOOL_REQUESTS_APPROVE (aprovar/rejeitar). toolKey:
          requests.
        </p>
      </PagePanel>
    </div>
  );
}
