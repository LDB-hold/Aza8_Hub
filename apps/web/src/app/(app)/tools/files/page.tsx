import { PagePanel } from '@components/PagePanel';

export default function FilesPage() {
  return (
    <div className="space-y-4" data-testid="files-page">
      <PagePanel
        title="Files"
        description="Uploads, versões e evidências por demanda no layout Navigation–Body–App Bar."
        icon="folder"
        helper="Ferramentas · RBAC"
        testId="files-panel"
      >
        <p className="text-xs text-[#49454F]">
          Permissões: TOOL_FILES_READ (listar) e TOOL_FILES_WRITE (upload). toolKey: files.
        </p>
      </PagePanel>
    </div>
  );
}
