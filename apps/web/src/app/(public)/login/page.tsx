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

type LanguageCode = 'ENG' | 'ES' | 'BR';

const LANGUAGE_OPTIONS: LanguageCode[] = ['ENG', 'ES', 'BR'];

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f5f1ff]" />}>
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
  const [darkMode, setDarkMode] = useState(false);

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

  const cardSurface = darkMode ? 'border-slate-700/80 bg-slate-900/90 text-slate-100' : 'border-slate-200/80 bg-white/95 text-slate-900';
  const subduedText = darkMode ? 'text-slate-400' : 'text-slate-500';
  const floatingButtonBase =
    'inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] shadow-[0_12px_30px_rgba(15,23,42,0.15)] transition focus:outline-none focus:ring-2 focus:ring-sky-200';

  return (
    <div className={`relative min-h-screen overflow-hidden transition-colors ${darkMode ? 'bg-[#303034]' : 'bg-[#FDFCFB]'}`}>
      <div
        className={`pointer-events-none absolute inset-0 transition ${
          darkMode
            ? 'bg-[radial-gradient(circle_at_top,_rgba(14,_165,_233,_0.18),_transparent_45%)]'
            : 'bg-[radial-gradient(circle_at_top,_rgba(3,_105,_161,_0.12),_transparent_45%)]'
        }`}
        aria-hidden="true"
      />
      <div
        className={`pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gradient-to-b ${
          darkMode ? 'from-slate-800/60 via-transparent to-transparent' : 'from-sky-200/70 via-transparent to-transparent'
        } blur-3xl`}
        aria-hidden="true"
      />
      <div className="relative mx-auto flex min-h-screen max-w-[450px] flex-col justify-center px-4 py-16 text-slate-900 transition-colors sm:px-6">
        <section className={`rounded-[32px] px-6 py-8 shadow-[0_50px_100px_-60px_rgba(15,23,42,0.95)] sm:px-8 ${cardSurface}`}>
          <header className="flex flex-col gap-2">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.4em] ${darkMode ? 'text-sky-400' : 'text-sky-600'}`}>Acesso ao Hub</p>
              <h2 className="mt-2 text-3xl font-semibold">Entrar</h2>
              <p className={`text-sm ${subduedText}`}>Use os e-mails seeds descritos no README para explorar o fluxo completo.</p>
            </div>
          </header>

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <Md3TextField
              id="email"
              label="E-mail seed"
              type="email"
              value={form.email}
              autoComplete="email"
              leadingIcon="mail"
              helperText="Exemplos: aza8_admin@aza8.com, owner@alpha. Consulte docs/pages.md."
              onChange={(value) => setForm((f) => ({ ...f, email: value }))}
            />

            <Md3TextField
              id="password"
              label="Senha"
              type="password"
              value={form.password}
              autoComplete="current-password"
              leadingIcon="lock"
              helperText="Ambiente mock: qualquer valor é aceito; campo exibido para demonstrar o padrão MD3 filled text field."
              onChange={(value) => setForm((f) => ({ ...f, password: value }))}
            />

            {form.error && (
              <div
                className="flex items-start gap-2 rounded-[24px] border border-rose-200 bg-rose-50/80 px-4 py-3 text-sm text-rose-700"
                role="alert"
              >
                <span className="material-symbols-rounded text-base" aria-hidden="true">
                  error
                </span>
                <span>{form.error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-[28px] bg-slate-900 px-4 py-3 text-base font-semibold text-white shadow-[0_18px_28px_-18px_rgba(15,23,42,1)] transition hover:bg-slate-800 focus:outline-none focus:ring-3 focus:ring-slate-400/50 disabled:opacity-60"
            >
              {loading ? 'Entrando...' : 'Entrar no Hub'}
              <span className="material-symbols-rounded text-base transition-transform group-hover:translate-x-1" aria-hidden="true">
                trending_flat
              </span>
            </button>
          </form>

          <div className={`mt-8 space-y-4 text-sm ${subduedText}`}>
            <p className="flex items-center gap-2">
              <span className={`material-symbols-rounded text-base ${darkMode ? 'text-slate-400' : 'text-slate-400'}`} aria-hidden="true">
                info
              </span>
              Mock login envia uma chamada para `/api/auth/mock-login` e aplica cookie httpOnly no host atual.
            </p>
            <p>
              Precisa de permissão adicional? Envie um e-mail para <a className="font-semibold text-slate-700" href="mailto:support@aza8.com">support@aza8.com</a>{' '}
              informando o tenant.
            </p>
          </div>
        </section>
      </div>
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 top-auto h-32 bg-gradient-to-t ${
          darkMode ? 'from-[#303034]' : 'from-[#FDFCFB]'
        } to-transparent`}
        aria-hidden="true"
      />
      <div className="fixed bottom-6 right-6 flex items-center gap-3 max-sm:bottom-4 max-sm:right-4">
        <button
          type="button"
          aria-label="Alternar tema"
          onClick={() => setDarkMode((prev) => !prev)}
          className={`${floatingButtonBase} ${darkMode ? 'border-slate-600 bg-slate-900/80 text-slate-50' : 'border-slate-200 bg-white/95 text-slate-700'}`}
        >
          <span className="material-symbols-rounded text-base" aria-hidden="true">
            {darkMode ? 'light_mode' : 'dark_mode'}
          </span>
          {darkMode ? 'LIGHT' : 'DARK'}
        </button>
        <button
          type="button"
          aria-label="Selecionar idioma"
          onClick={cycleLanguage}
          className={`${floatingButtonBase} ${darkMode ? 'border-slate-600 bg-slate-900/80 text-slate-50' : 'border-slate-200 bg-white/95 text-slate-700'}`}
        >
          <span className="material-symbols-rounded text-base" aria-hidden="true">
            g_translate
          </span>
          {language}
        </button>
      </div>
    </div>
  );
}

type Md3TextFieldProps = {
  id: string;
  label: string;
  value: string;
  type?: string;
  leadingIcon?: string;
  helperText?: string;
  autoComplete?: string;
  onChange: (value: string) => void;
};

function Md3TextField({ id, label, value, type = 'text', leadingIcon, helperText, autoComplete, onChange }: Md3TextFieldProps) {
  const helperId = helperText ? `${id}-helper` : undefined;

  return (
    <div className="space-y-2">
      <div className="relative">
        {leadingIcon && (
          <span className="material-symbols-rounded pointer-events-none absolute left-4 top-4 text-lg text-slate-500" aria-hidden="true">
            {leadingIcon}
          </span>
        )}
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          autoComplete={autoComplete}
          placeholder=" "
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={helperId}
          className={`peer block w-full rounded-[20px] border border-slate-200/80 bg-white pb-2 pt-5 pr-4 text-base text-slate-900 shadow-[inset_0_1px_0_rgba(15,23,42,0.04)] transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 ${
            leadingIcon ? 'pl-12' : 'pl-4'
          }`}
        />
        <label
          htmlFor={id}
          className={`pointer-events-none absolute ${
            leadingIcon ? 'left-12' : 'left-4'
          } top-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-slate-500 transition-all duration-150 ease-out peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:font-medium peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-slate-500/70 peer-focus:top-1.5 peer-focus:text-[0.65rem] peer-focus:tracking-[0.35em] peer-focus:text-sky-600`}
        >
          {label}
        </label>
      </div>
      {helperText && (
        <p id={helperId} className="text-xs text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
