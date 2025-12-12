'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { PageFrame } from '../../components/PageFrame';

export default function HubTenantsPage() {
  const [tenants, setTenants] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/hub/tenants')
      .then(setTenants)
      .catch(() => setError('Erro ao carregar'));
  }, []);

  return (
    <PageFrame title="Tenants" description="Lista de tenants" permissions={['HUB_TENANT_READ']}>
      {error && <div data-testid="tenants-error">{error}</div>}
      <table data-testid="tenants-table">
        <thead>
          <tr>
            <th>Slug</th>
            <th>Nome</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((t) => (
            <tr key={t.id}>
              <td>{t.slug}</td>
              <td>{t.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageFrame>
  );
}
