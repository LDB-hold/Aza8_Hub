'use client';

import { ROLES } from '@aza8/core-domain';
import { PageFrame } from '../../../components/PageFrame';

export default function HubRolesPage() {
  return (
    <PageFrame title="Hub Roles" description="Roles configuradas" permissions={['HUB_RBAC_VIEW']}>
      <ul>
        {ROLES.filter((r) => r.scope === 'HUB').map((role) => (
          <li key={role.key}>
            {role.key} – {role.description}
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
