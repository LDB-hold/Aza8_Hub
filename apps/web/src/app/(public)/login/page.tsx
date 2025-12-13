'use client';

import Image from 'next/image';
import { FormEvent, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';

const MOCK_LOGIN_ENDPOINT = '/api/auth/mock-login';

type FormState = {
  email: string;
  password: string;
  error?: string;
};

type LanguageCode = 'ENG' | 'ES' | 'BR';

const LANGUAGE_OPTIONS: LanguageCode[] = ['ENG', 'ES', 'BR'];

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
  const [language, setLanguage] = useState<LanguageCode>('BR');

  const performLogin = async (email: string) => {
    const res = await fetch(MOCK_LOGIN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error ?? 'Não foi possível entrar');
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setForm((f) => ({ ...f, error: undefined }));
    if (!form.email) {
      setForm((f) => ({ ...f, error: 'E-mail é obrigatório' }));
      setLoading(false);
      return;
    }
    try {
      await performLogin(form.email);
      router.push(returnUrl);
    } catch (err: any) {
      setForm((f) => ({ ...f, error: err.message ?? 'Não foi possível concluir o login' }));
    } finally {
      setLoading(false);
    }
  };

  const cycleLanguage = () => {
    setLanguage((current) => {
      const currentIndex = LANGUAGE_OPTIONS.indexOf(current);
      const nextIndex = (currentIndex + 1) % LANGUAGE_OPTIONS.length;
      return LANGUAGE_OPTIONS[nextIndex];
    });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#e0f2fe,_transparent_45%),#f8fafc] px-4 py-10">
      <div className="absolute top-4 right-4 text-right">
        <button
          type="button"
          aria-label="Selecionar idioma"
          onClick={cycleLanguage}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          <span className="material-symbols-rounded text-base leading-none" aria-hidden="true">
            g_translate
          </span>
          {language}
        </button>
      </div>
      <div className="w-full max-w-md space-y-6">
        <header className="text-center space-y-2">
          <div className="flex justify-center pb-[50px]">
            <Image src="/Logo_Preto.svg" alt="Aza8 Hub" width={180} height={70} priority />
          </div>
        </header>

        <div className="bg-white shadow-lg border border-slate-200/80 rounded-2xl p-6 space-y-4">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold text-slate-900">Entrar</h1>
            <p className="text-sm text-slate-600">Acesse suas ferramentas de trabalho</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm text-slate-700" htmlFor="email">
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                placeholder="voce@empresa.com"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm text-slate-700" htmlFor="password">
                Senha
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
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500">
          Aza8 Hub é o portal onde você organiza tarefas, arquivos e solicitações do seu projeto em um só lugar, com mais controle, transparência e colaboração entre todos os envolvidos.
        </p>
      </div>
    </div>
  );
}
