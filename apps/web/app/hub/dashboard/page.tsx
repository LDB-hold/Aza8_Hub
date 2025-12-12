'use client';

import { PageFrame } from '../../components/PageFrame';

export default function HubDashboardPage() {
  return (
    <PageFrame
      title="Hub Dashboard"
      description="Visão geral para time interno."
      permissions={['HUB_DASHBOARD_VIEW']}
    >
      <p>Use o menu para acessar tenants, RBAC e auditoria.</p>
    </PageFrame>
  );
}
