'use client';

import { useEffect, useState } from 'react';
import { apiFetch, fetchMe } from '../../../lib/api';
import { PageFrame } from '../../../components/PageFrame';

type RequestItem = { id: string; title: string; description: string; status: string };

export default function RequestsPage() {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [canApprove, setCanApprove] = useState(false);

  const load = () => apiFetch<RequestItem[]>('/portal/tools/requests').then(setItems);
  useEffect(() => {
    load();
    fetchMe().then((me) => setCanApprove(Boolean(me?.permissions.includes('TOOL_REQUESTS_APPROVE'))));
  }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    await apiFetch('/portal/tools/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    });
    setTitle('');
    setDescription('');
    load();
  };

  const decide = async (id: string, action: 'approve' | 'reject') => {
    await apiFetch(`/portal/tools/requests/${id}/${action}`, { method: 'POST' });
    load();
  };

  return (
    <PageFrame
      title="Requests"
      description="Solicitações e aprovações"
      permissions={['TOOL_REQUESTS_READ', 'TOOL_REQUESTS_CREATE']}
      toolKey="requests"
    >
      <form onSubmit={create} data-testid="request-create-form">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
        <button type="submit">Criar</button>
      </form>
      <table data-testid="requests-table">
        <thead>
          <tr>
            <th>Título</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id}>
              <td>{r.title}</td>
              <td>{r.status}</td>
              <td>
                {canApprove && (
                  <>
                    <button onClick={() => decide(r.id, 'approve')}>Approve</button>
                    <button onClick={() => decide(r.id, 'reject')}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageFrame>
  );
}
