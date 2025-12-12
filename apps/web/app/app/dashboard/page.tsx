'use client';

import { PageFrame } from '../../components/PageFrame';
import { toolEnabledForTenant } from '../../lib/navigation';
import { getHostParts } from '../../lib/tenant';

const TOOL_TITLES = ['tasks', 'files', 'requests', 'reports'] as const;

export default function PortalDashboardPage() {
  const { slug } = getHostParts();
  return (
    <PageFrame title="Portal Dashboard" description="Visão geral do tenant" permissions={['PORTAL_DASHBOARD_VIEW']}>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
        {TOOL_TITLES.map((tool) => {
          const enabled = toolEnabledForTenant(slug, tool);
          return (
            <div key={tool} className="card" data-testid={`tool-${tool}`}>
              <strong>{tool}</strong>
              <div>{enabled ? 'Enabled' : 'Disabled'}</div>
            </div>
          );
        })}
      </div>
    </PageFrame>
  );
}
