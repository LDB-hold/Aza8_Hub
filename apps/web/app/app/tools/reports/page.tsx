'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../../lib/api';
import { PageFrame } from '../../../components/PageFrame';

export default function ReportsPage() {
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    apiFetch('/portal/tools/reports/summary').then(setSummary);
  }, []);

  return (
    <PageFrame title="Reports" description="Resumo simples" permissions={['TOOL_REPORTS_READ']} toolKey="reports">
      {summary ? (
        <ul data-testid="reports-summary">
          <li>Tasks: {summary.tasks}</li>
          <li>Files: {summary.files}</li>
          <li>Requests: {summary.requests}</li>
        </ul>
      ) : (
        <div>Loading...</div>
      )}
    </PageFrame>
  );
}
