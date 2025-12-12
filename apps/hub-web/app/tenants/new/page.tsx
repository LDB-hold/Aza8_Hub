'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Layout, Text, Button } from '@aza8/ui';

import { apiClient } from '../../lib/api-client';
import { createTenant } from '../../lib/tenants-service';

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function NewTenantPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const resolvedSlug = slug || slugify(name);
    if (!name || !resolvedSlug) {
      setError('Preencha nome e slug.');
      return;
    }
    setLoading(true);
    try {
      await createTenant(apiClient, { name, slug: resolvedSlug });
      router.push('/tenants');
      router.refresh();
    } catch (err: any) {
      setError(err?.message ?? 'Não foi possível criar o cliente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Novo cliente" description="Crie um tenant e siga para habilitar ferramentas.">
      <div className="mb-4 text-sm text-slate-300">
        <Link className="text-sky-300 hover:text-sky-200" href="/tenants">
          ← Voltar para lista
        </Link>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="space-y-1">
          <label className="text-sm text-slate-200" htmlFor="name">Nome</label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slug) setSlug(slugify(e.target.value));
            }}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 focus:border-sky-400 focus:outline-none"
            placeholder="Cliente Exemplo"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-slate-200" htmlFor="slug">Slug</label>
          <input
            id="slug"
            name="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 focus:border-sky-400 focus:outline-none"
            placeholder="cliente-exemplo"
          />
          <p className="text-xs text-slate-400">Usado para subdomínio e identificação interna.</p>
        </div>

        {error && <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">{error}</div>}

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading}>
            {loading ? 'Criando...' : 'Criar cliente'}
          </Button>
          <Text tone="muted">Após criar, habilite ferramentas e convide usuários.</Text>
        </div>
      </form>
    </Layout>
  );
}
