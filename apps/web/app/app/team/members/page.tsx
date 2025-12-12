'use client';

import { useEffect, useState } from 'react';
import { apiFetch, fetchMe } from '../../../lib/api';
import { PageFrame } from '../../../components/PageFrame';

type Member = { id: string; email: string; roleKey: string; userId: string };

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [newRole, setNewRole] = useState('MEMBER');
  const [canChangeRole, setCanChangeRole] = useState(false);

  const load = () => apiFetch<Member[]>('/portal/members').then(setMembers);
  useEffect(() => {
    load();
    fetchMe().then((me) => setCanChangeRole(Boolean(me?.permissions.includes('TENANT_MEMBER_ROLE_UPDATE'))));
  }, []);

  const updateRole = async (userId: string) => {
    await apiFetch(`/portal/members/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleKey: newRole })
    });
    load();
  };

  return (
    <PageFrame title="Members" description="Membros do tenant" permissions={['TENANT_MEMBER_READ']}>
      <div>
        Role alvo:
        <select value={newRole} onChange={(e) => setNewRole(e.target.value)} data-testid="role-select">
          <option value="OWNER">OWNER</option>
          <option value="MANAGER">MANAGER</option>
          <option value="MEMBER">MEMBER</option>
          <option value="SUPPLIER">SUPPLIER</option>
        </select>
      </div>
      <table data-testid="members-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id}>
              <td>{m.email}</td>
              <td>{m.roleKey}</td>
              <td>
                {canChangeRole && <button onClick={() => updateRole(m.userId)}>Atualizar</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageFrame>
  );
}
