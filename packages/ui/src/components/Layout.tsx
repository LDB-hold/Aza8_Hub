import { PropsWithChildren } from 'react';

export interface LayoutProps extends PropsWithChildren {
  title?: string;
  description?: string;
}

export const Layout = ({ title, description, children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-4">
          <span className="text-xs uppercase tracking-wide text-emerald-400">
            Aza8 Hub
          </span>
          {title && <h1 className="text-2xl font-semibold">{title}</h1>}
          {description && (
            <p className="text-sm text-slate-300">{description}</p>
          )}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
};
