'use client';

import './globals.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { fetchMe, apiFetch } from './lib/api';
import { filterNav } from './lib/navigation';
import { getHostParts } from './lib/tenant';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [me, setMe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { slug, isHub } = getHostParts();
  const area = isHub ? 'hub' : 'portal';
  const permissions = me?.permissions ?? [];
  const menu = filterNav(area, permissions, slug);

  useEffect(() => {
    fetchMe().then(setMe).finally(() => setLoading(false));
  }, []);

  const logout = async () => {
    await apiFetch('/auth/logout', { method: 'POST' });
    setMe(null);
    window.location.href = '/auth/login';
  };

  return (
    <html lang="en">
      <body>
        <div className="header">
          <div>
            <strong>Aza8 Hub</strong> – {area === 'hub' ? 'Hub' : `Portal ${slug ?? ''}`}
          </div>
          <div>
            {loading && <span>Loading session...</span>}
            {!loading && me && (
              <>
                <span data-testid="current-user-email">{me.user.email}</span>{' '}
                <button onClick={logout} data-testid="logout-btn">
                  Logout
                </button>
              </>
            )}
            {!loading && !me && <Link href="/auth/login">Login</Link>}
          </div>
        </div>
        <div className="layout">
          <aside className="sidebar">
            <div className="menu-section">
              {menu.map((item) => (
                <Link key={item.path} href={item.path as any} className="menu-item" data-testid={`nav-${item.path}`}>
                  {item.label}
                </Link>
              ))}
              {menu.length === 0 && <div data-testid="menu-empty">Sem itens</div>}
            </div>
          </aside>
          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
