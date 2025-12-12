'use client';

import { useState } from 'react';
import { apiFetch } from '../../../lib/api';
import { PageFrame } from '../../../components/PageFrame';

export default function NewTenantPage() {
  const [slug, setSlug] = useState('');
  const [name, setName] = useState('');
  const [result, setResult] = useState<any>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiFetch('/hub/tenants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, name })
    });
    setResult(res);
  };

  return (
    <PageFrame title="Criar tenant" description="Criar novo tenant" permissions={['HUB_TENANT_WRITE']}>
      <form onSubmit={onSubmit}>
        <input placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} data-testid="new-tenant-slug" />
        <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} data-testid="new-tenant-name" />
        <button type="submit" data-testid="new-tenant-submit">
          Criar
        </button>
      </form>
      {result && <pre data-testid="new-tenant-result">{JSON.stringify(result, null, 2)}</pre>}
    </PageFrame>
  );
}
