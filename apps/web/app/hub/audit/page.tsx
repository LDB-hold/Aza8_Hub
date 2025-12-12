'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { PageFrame } from '../../components/PageFrame';

export default function HubAuditPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/hub/audit').then(setItems);
  }, []);

  return (
    <PageFrame title="Hub Audit" description="Eventos de auditoria" permissions={['HUB_AUDIT_READ']}>
      <table data-testid="hub-audit-table">
        <thead>
          <tr>
            <th>Ação</th>
            <th>Entidade</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.action}</td>
              <td>
                {item.entity} {item.entityId}
              </td>
              <td>{item.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageFrame>
  );
}
