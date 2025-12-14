import { PagePanel } from '@components/PagePanel';

export default function MembersPage() {
  return (
    <div className="space-y-4" data-testid="team-members-page">
      <PagePanel
        title="Team — Members"
        description="Gerencie membros, papéis e acessos com o mesmo app bar e rail."
        icon="groups"
        helper="Equipe · RBAC"
        testId="team-members-panel"
      >
        <p className="text-xs text-[#49454F]">
          Permissão necessária: TENANT_MEMBER_READ. Atualizar papel exige TENANT_MEMBER_ROLE_UPDATE.
        </p>
      </PagePanel>
    </div>
  );
}
