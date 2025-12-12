'use client';

import { PageFrame } from '../../components/PageFrame';
import { toolEnabledForTenant } from '../../lib/navigation';
import { getHostParts } from '../../lib/tenant';

const TOOLS = ['tasks', 'files', 'requests', 'reports'] as const;

export default function ToolsIndexPage() {
  const { slug } = getHostParts();
  return (
    <PageFrame title="Tools" description="Ferramentas instaladas" permissions={['PORTAL_DASHBOARD_VIEW']}>
      <ul data-testid="tools-list">
        {TOOLS.map((tool) => (
          <li key={tool}>
            {tool} – {toolEnabledForTenant(slug, tool) ? 'enabled' : 'disabled'}
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
