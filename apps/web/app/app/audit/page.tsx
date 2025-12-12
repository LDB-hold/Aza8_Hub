'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { PageFrame } from '../../components/PageFrame';

export default function PortalAuditPage() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    apiFetch('/portal/audit').then(setItems);
  }, []);

  return (
    <PageFrame title="Audit" description="Logs do tenant" permissions={['AUDIT_READ']}>
      <ul data-testid="portal-audit-list">
        {items.map((i) => (
          <li key={i.id}>
            {i.action} - {i.entity}
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
