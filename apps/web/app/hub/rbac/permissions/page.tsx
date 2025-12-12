'use client';

import { PERMISSIONS } from '@aza8/core-domain';
import { PageFrame } from '../../../components/PageFrame';

export default function HubPermissionsPage() {
  return (
    <PageFrame title="Hub Permissions" description="Permissões configuradas" permissions={['HUB_RBAC_VIEW']}>
      <ul>
        {PERMISSIONS.filter((p) => p.scope === 'HUB').map((p) => (
          <li key={p.key}>
            {p.key} – {p.description}
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
