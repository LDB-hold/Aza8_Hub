'use client';

import { useParams } from 'next/navigation';
import { PageFrame } from '../../../../components/PageFrame';

export default function TenantOverviewPage() {
  const params = useParams();
  const tenantId = params?.tenantId as string;
  return (
    <PageFrame
      title={`Tenant ${tenantId}`}
      description="Overview do tenant"
      permissions={['HUB_TENANT_READ']}
    >
      <p data-testid="tenant-overview-id">{tenantId}</p>
    </PageFrame>
  );
}
