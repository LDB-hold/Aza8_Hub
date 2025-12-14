'use client';

import { useEffect, useMemo, useState } from 'react';
import { PagePanel } from '@components/PagePanel';
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

  const activeInvites = useMemo(() => invites.filter((i) => !i.acceptedAt), [invites]);

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
    <div className="space-y-6" data-testid="team-invitations-page">
      <PagePanel
        title="Team — Invitations"
        description="Convide usuários e acompanhe tokens com o layout Navigation–Body–App Bar."
        icon="person_add"
        helper="Equipe · RBAC"
        testId="team-invitations-panel"
      >
        <p className="text-xs text-[#49454F]">Permissão necessária: TENANT_MEMBER_INVITE.</p>
      </PagePanel>

      <Card
        className="border-[#E6E0E9] bg-white/90 shadow-[0_16px_44px_-34px_rgba(28,27,31,0.3)]"
        data-testid="invite-form-card"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-[#1C1B1F]">Novo convite</CardTitle>
          <CardDescription className="text-sm text-[#49454F]">
            Defina e-mail e papel. O token fica disponível para compartilhamento.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={onSubmit} className="grid items-end gap-4 md:grid-cols-[2fr_1fr_auto]">
            <div className="space-y-2">
              <label className="text-sm text-[#1C1B1F]" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-2xl border border-[#E6E0E9] bg-white/80 px-3 py-2.5 text-sm text-[#1C1B1F] outline-none focus-visible:border-[#6750A4] focus-visible:ring-2 focus-visible:ring-[#EADDFF]"
                placeholder="pessoa@empresa.com"
                data-testid="invite-email-input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#1C1B1F]" htmlFor="role">
                Papel
              </label>
              <select
                id="role"
                value={form.roleKey}
                onChange={(e) => setForm((f) => ({ ...f, roleKey: e.target.value }))}
                className="w-full rounded-2xl border border-[#E6E0E9] bg-white/80 px-3 py-2.5 text-sm text-[#1C1B1F] outline-none focus-visible:border-[#6750A4] focus-visible:ring-2 focus-visible:ring-[#EADDFF]"
                data-testid="invite-role-select"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role.key} value={role.key}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[#6750A4] px-5 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_-18px_rgba(103,80,164,0.8)] transition hover:bg-[#7F67BE] disabled:opacity-60"
              data-testid="invite-submit"
            >
              {submitting ? 'Enviando...' : 'Criar convite'}
            </button>
          </form>
          {error ? (
            <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
          ) : null}
        </CardContent>
      </Card>

      <Card
        className="border-[#E6E0E9] bg-white/90 shadow-[0_16px_44px_-34px_rgba(28,27,31,0.3)]"
        data-testid="invite-list-card"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-[#1C1B1F]">Convites ativos</CardTitle>
          <CardDescription className="text-sm text-[#49454F]">Tokens aguardando aceite.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <p className="text-sm text-[#49454F]">Carregando...</p>
          ) : activeInvites.length === 0 ? (
            <p className="text-sm text-[#49454F]">Nenhum convite pendente.</p>
          ) : (
            <ul className="divide-y divide-[#E6E0E9]">
              {activeInvites.map((invite) => (
                <li key={invite.id} className="flex items-center justify-between py-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#1C1B1F]">{invite.email}</p>
                    <p className="text-xs text-[#49454F]">
                      Papel: {invite.roleKey} · Expira em {new Date(invite.expiresAt).toLocaleDateString()}
                    </p>
                  </div>
                  <code className="rounded-full border border-dashed border-[#E6E0E9] bg-white/70 px-3 py-1 text-xs text-[#1C1B1F]">
                    {invite.token}
                  </code>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
