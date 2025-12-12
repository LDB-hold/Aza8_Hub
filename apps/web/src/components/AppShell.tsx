import Link from 'next/link';
import { TenantBadge } from './TenantBadge';
import { LogoutButton } from './LogoutButton';
import { Session } from '../lib/auth';
import { TenantContext } from '../lib/tenant';
import { Avatar } from './ui/avatar';
import { cn } from '../lib/utils';

export function AppShell({ children, session, tenant }: { children: React.ReactNode; session: Session; tenant: TenantContext }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="font-semibold text-slate-900">
              Aza8 Hub
            </Link>
            <TenantBadge tenantKey={tenant.tenantKey} isHub={tenant.isHub} />
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end text-xs leading-tight text-slate-600">
              <span className="font-semibold text-slate-900">{session.user.name}</span>
              <span>{session.user.email}</span>
            </div>
            <Avatar name={session.user.name} />
            <LogoutButton className="hidden sm:inline-flex" />
          </div>
        </div>
      </header>

      <main className={cn('mx-auto px-4 pb-10 pt-8 md:px-8 md:pt-10', 'max-w-6xl')}>{children}</main>
    </div>
  );
}
