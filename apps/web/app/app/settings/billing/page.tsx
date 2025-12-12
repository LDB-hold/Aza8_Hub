'use client';

import { PageFrame } from '../../../components/PageFrame';

export default function BillingPage() {
  return (
    <PageFrame
      title="Billing"
      description="Somente OWNER"
      permissions={['TENANT_BILLING_READ']}
    >
      <p data-testid="billing-placeholder">Billing placeholder</p>
    </PageFrame>
  );
}
