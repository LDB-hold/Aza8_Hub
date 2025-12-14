import { PagePanel } from '@components/PagePanel';

export default function TasksPage() {
  return (
    <div className="space-y-4" data-testid="tasks-page">
      <PagePanel
        title="Tasks"
        description="Gerencie listas, status e checklists seguindo o layout Navigation–Body–App Bar."
        icon="checklist"
        helper="Ferramentas · RBAC"
        testId="tasks-panel"
      >
        <p className="text-xs text-[#49454F]">
          Permissões necessárias: TOOL_TASKS_READ (visualizar) e TOOL_TASKS_WRITE (editar). toolKey: tasks.
        </p>
      </PagePanel>
    </div>
  );
}
