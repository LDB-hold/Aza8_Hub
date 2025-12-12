'use client';

import { PageFrame } from '../../../components/PageFrame';

export default function OrganizationPage() {
  return (
    <PageFrame
      title="Organization"
      description="Informações do tenant"
      permissions={['TENANT_SETTINGS_READ']}
    >
      <p>Placeholder para informações do tenant.</p>
    </PageFrame>
  );
}
