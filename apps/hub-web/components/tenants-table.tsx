'use client';

import Link from 'next/link';
import { Layout, Text, Button } from '@aza8/ui';

import { useTenants } from '../lib/use-tenants';

export const TenantsTable = () => {
  const { tenants, loading, error, refresh } = useTenants();

  return (
    <Layout title="Tenants" description="Gestão de clientes do hub">
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-slate-300">
          <Text tone="muted">Crie um cliente e habilite ferramentas.</Text>
        </div>
        <Button asChild>
          <Link href="/tenants/new">Novo cliente</Link>
        </Button>
      </div>

      {loading && <Text tone="muted">Carregando lista de tenants…</Text>}
      {error && (
        <Text tone="muted">
          Falha ao carregar tenants. <button onClick={() => refresh()}>Tentar novamente</button>
        </Text>
      )}
      {!loading && tenants.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-900/70 text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Plano</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="border-t border-slate-800">
                  <td className="px-4 py-3">{tenant.name}</td>
                  <td className="px-4 py-3 text-slate-400">{tenant.slug}</td>
                  <td className="px-4 py-3">{tenant.plan ?? 'N/D'}</td>
                  <td className="px-4 py-3 capitalize">{tenant.status?.toLowerCase() ?? 'ativo'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!loading && tenants.length === 0 && !error && <Text tone="muted">Nenhum tenant disponível.</Text>}
    </Layout>
  );
};
