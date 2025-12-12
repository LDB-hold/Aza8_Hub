'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';
import { PageFrame } from '../../../components/PageFrame';

type Invite = { id: string; email: string; roleKey: string; token: string };

export default function InvitationsPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [email, setEmail] = useState('');
  const [roleKey, setRoleKey] = useState('MEMBER');

  const load = () => apiFetch<Invite[]>('/portal/invites').then(setInvites);
  useEffect(() => {
    load();
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/portal/invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, roleKey })
    });
    setEmail('');
    load();
  };

  return (
    <PageFrame
      title="Invitations"
      description="Convites pendentes"
      permissions={['TENANT_MEMBER_INVITE']}
    >
      <form onSubmit={create}>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
        <select value={roleKey} onChange={(e) => setRoleKey(e.target.value)}>
          <option value="OWNER">OWNER</option>
          <option value="MANAGER">MANAGER</option>
          <option value="MEMBER">MEMBER</option>
          <option value="SUPPLIER">SUPPLIER</option>
        </select>
        <button type="submit">Convidar</button>
      </form>
      <ul data-testid="invites-list">
        {invites.map((invite) => (
          <li key={invite.id}>
            {invite.email} – {invite.roleKey} – token {invite.token}
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
