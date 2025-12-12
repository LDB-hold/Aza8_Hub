'use client';

import { FormEvent, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';

const MOCK_LOGIN_ENDPOINT = '/api/auth/mock-login';

type FormState = {
  email: string;
  password: string;
  error?: string;
};

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const search = useSearchParams();
  const rawReturnUrl = search?.get('returnUrl');
  const returnUrl: Route = rawReturnUrl && rawReturnUrl.startsWith('/') ? (rawReturnUrl as Route) : ('/dashboard' as Route);

  const [form, setForm] = useState<FormState>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const performLogin = async (email: string) => {
    const res = await fetch(MOCK_LOGIN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? 'Unable to login');
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setForm((f) => ({ ...f, error: undefined }));
    if (!form.email) {
      setForm((f) => ({ ...f, error: 'Email is required' }));
      setLoading(false);
      return;
    }
    try {
      await performLogin(form.email);
      router.push(returnUrl);
    } catch (err: any) {
      setForm((f) => ({ ...f, error: err.message ?? 'Login failed' }));
    } finally {
      setLoading(false);
    }
  };

  const onMockSso = async () => {
    try {
      await performLogin(form.email || 'demo@aza8.com');
      router.push(returnUrl);
    } catch (err: any) {
      setForm((f) => ({ ...f, error: err.message ?? 'Login failed' }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#e0f2fe,_transparent_45%),#f8fafc] px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <header className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-slate-200 text-sm text-slate-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-sky-400 inline-block" />
            <span>Aza8 Hub</span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Sign in</h1>
            <p className="text-sm text-slate-600">Access your workspace tools</p>
          </div>
        </header>

        <div className="bg-white shadow-lg border border-slate-200/80 rounded-2xl p-6 space-y-4">
          <button
            type="button"
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 transition hover:border-slate-300 hover:bg-white"
            onClick={onMockSso}
            disabled={loading}
          >
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
            Continue with Aza8 Auth (mock)
          </button>

          <div className="relative text-center text-xs text-slate-500">
            <span className="bg-white px-2 relative">or continue with email</span>
            <span className="absolute left-0 right-0 top-1/2 h-px bg-slate-200" aria-hidden />
          </div>

          <form onSubmit={onSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm text-slate-700" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                placeholder="you@company.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-slate-700" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {form.error && <div className="text-sm text-rose-600 bg-rose-50 border border-rose-100 rounded-xl px-3 py-2">{form.error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-slate-900 text-white px-3 py-2.5 text-sm font-semibold transition hover:bg-slate-800 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500">Mock mode enabled (AUTH_MODE=mock).</p>
      </div>
    </div>
  );
}
