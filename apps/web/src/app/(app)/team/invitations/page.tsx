'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { apiFetch } from '@lib/api';

type Invite = {
  id: string;
  email: string;
  roleKey: string;
  token: string;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
};

const ROLE_OPTIONS = [
  { key: 'OWNER', label: 'Owner' },
  { key: 'MANAGER', label: 'Manager' },
  { key: 'MEMBER', label: 'Member' },
  { key: 'SUPPLIER', label: 'Supplier' }
];

export default function InvitationsPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', roleKey: 'MEMBER' });

  const activeInvites = useMemo(
    () => invites.filter((i) => !i.acceptedAt),
    [invites]
  );

  const fetchInvites = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch<Invite[]>('/portal/invites');
      setInvites(data);
    } catch (err: any) {
      setError(err?.message ?? 'Não foi possível carregar convites.');
      setInvites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchInvites();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await apiFetch<Invite>('/portal/invites', {
        method: 'POST',
        body: { email: form.email, roleKey: form.roleKey }
      });
      setForm({ email: '', roleKey: form.roleKey });
      await fetchInvites();
    } catch (err: any) {
      setError(err?.message ?? 'Não foi possível criar o convite.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Convites</h1>
        <p className="text-sm text-slate-600">Convide usuários para o tenant e acompanhe aceites.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Novo convite</CardTitle>
          <CardDescription>Defina e-mail e papel. O token fica disponível para compartilhamento.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-[2fr_1fr_auto] items-end">
            <div className="space-y-1">
              <label className="text-sm text-slate-700" htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
                placeholder="pessoa@empresa.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-slate-700" htmlFor="role">Papel</label>
              <select
                id="role"
                value={form.roleKey}
                onChange={(e) => setForm((f) => ({ ...f, roleKey: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-sky-400 focus:outline-none"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role.key} value={role.key}>{role.label}</option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {submitting ? 'Enviando...' : 'Criar convite'}
            </button>
          </form>
          {error && <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Convites pendentes</CardTitle>
          <CardDescription>Tokens válidos ainda não aceitos.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-sm text-slate-600">Carregando convites...</p>}
          {!loading && activeInvites.length === 0 && <p className="text-sm text-slate-600">Nenhum convite pendente.</p>}
          {!loading && activeInvites.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">E-mail</th>
                    <th className="px-4 py-3">Papel</th>
                    <th className="px-4 py-3">Token</th>
                    <th className="px-4 py-3">Expira em</th>
                  </tr>
                </thead>
                <tbody>
                  {activeInvites.map((invite) => (
                    <tr key={invite.id} className="border-t">
                      <td className="px-4 py-3">{invite.email}</td>
                      <td className="px-4 py-3">{invite.roleKey}</td>
                      <td className="px-4 py-3 font-mono text-xs">{invite.token}</td>
                      <td className="px-4 py-3 text-slate-600">{new Date(invite.expiresAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
          <CardDescription>Convites criados e aceitos.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && <p className="text-sm text-slate-600">Carregando histórico...</p>}
          {!loading && invites.length === 0 && <p className="text-sm text-slate-600">Nenhum convite registrado.</p>}
          {!loading && invites.length > 0 && (
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3">E-mail</th>
                    <th className="px-4 py-3">Papel</th>
                    <th className="px-4 py-3">Criado em</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invites.map((invite) => (
                    <tr key={invite.id} className="border-t">
                      <td className="px-4 py-3">{invite.email}</td>
                      <td className="px-4 py-3">{invite.roleKey}</td>
                      <td className="px-4 py-3 text-slate-600">{new Date(invite.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        {invite.acceptedAt ? (
                          <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                            Aceito em {new Date(invite.acceptedAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">Pendente</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
