'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiFetch } from '../../../../lib/api';
import { PageFrame } from '../../../../components/PageFrame';

type Install = { id: string; toolKey: string; enabled: boolean; tool?: { name: string } };

export default function TenantToolsPage() {
  const tenantId = useParams()?.tenantId as string;
  const [installs, setInstalls] = useState<Install[]>([]);

  const load = () => {
    apiFetch<Install[]>(`/hub/tenants/${tenantId}/tools`).then(setInstalls);
  };

  useEffect(() => {
    if (tenantId) load();
  }, [tenantId]);

  const toggle = async (toolKey: string, enabled: boolean) => {
    await apiFetch(`/hub/tenants/${tenantId}/tools/${toolKey}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled: !enabled })
    });
    load();
  };

  return (
    <PageFrame
      title="Tools install"
      description="Habilitar/desabilitar ferramentas"
      permissions={['HUB_TOOLS_MANAGE']}
    >
      <table data-testid="tenant-tools-table">
        <thead>
          <tr>
            <th>Tool</th>
            <th>Enabled</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {installs.map((i) => (
            <tr key={i.id}>
              <td>{i.tool?.name ?? i.toolKey}</td>
              <td>{i.enabled ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={() => toggle(i.toolKey, i.enabled)} data-testid={`toggle-${i.toolKey}`}>
                  Toggle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageFrame>
  );
}
