'use client';

import { useParams } from 'next/navigation';
import { PageFrame } from '../../../../components/PageFrame';

export default function TenantUsersPage() {
  const tenantId = useParams()?.tenantId as string;
  return (
    <PageFrame
      title="Tenant Users"
      description="Usuários do tenant (placeholder)"
      permissions={['HUB_TENANT_USERS_READ']}
    >
      <p data-testid="tenant-users-id">{tenantId}</p>
    </PageFrame>
  );
}
