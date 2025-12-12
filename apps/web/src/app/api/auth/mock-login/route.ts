import { NextRequest, NextResponse } from 'next/server';
import { apiBaseUrl } from '@lib/config';
import { clearSessionCookie, logDev } from '@lib/auth';
import { parseTenantFromHost } from '@lib/tenant';

const AUTH_MODE = (process.env.AUTH_MODE as 'mock' | 'oidc' | undefined) ?? 'mock';
const SESSION_COOKIE = 'session';

const setSessionCookie = (res: NextResponse, userId: string, host?: string | null) => {
  const domain = getCookieDomain(host);
  res.cookies.set(SESSION_COOKIE, userId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    ...(domain ? { domain } : {})
  });
};

const getCookieDomain = (host?: string | null) => {
  if (!host) return undefined;
  if (host.includes('localhost') || host.startsWith('127.')) return undefined;
  const parts = host.split('.');
  if (parts.length >= 2) {
    return `.${parts.slice(-2).join('.')}`;
  }
  return undefined;
};

async function doLogin(email: string, tenantSlug?: string) {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (tenantSlug && tenantSlug !== 'hub') {
    headers['x-tenant-slug'] = tenantSlug;
  }

  const res = await fetch(`${apiBaseUrl}/auth/login`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ email }),
    cache: 'no-store'
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? 'Login failed');
  }

  return (await res.json()) as { user: { id: string; email: string; name: string } };
}

export async function POST(req: NextRequest) {
  if (AUTH_MODE !== 'mock') {
    return NextResponse.json({ error: 'Mock login disabled' }, { status: 400 });
  }
  const body = (await req.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email;
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  const host = req.headers.get('host');
  const tenant = parseTenantFromHost(host);
  try {
    const userContext = await doLogin(email, tenant.isHub ? undefined : tenant.tenantKey);
    const res = NextResponse.json({ ok: true, user: userContext.user });
    setSessionCookie(res, userContext.user.id, host ?? undefined);
    logDev('mock login', { email, tenant });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Unable to login' }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  if (AUTH_MODE !== 'mock') {
    return NextResponse.json({ error: 'Mock login disabled' }, { status: 400 });
  }
  const email = req.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  const host = req.headers.get('host');
  const tenant = parseTenantFromHost(host);
  try {
    const userContext = await doLogin(email, tenant.isHub ? undefined : tenant.tenantKey);
    const res = NextResponse.json({ ok: true, user: userContext.user });
    setSessionCookie(res, userContext.user.id, host ?? undefined);
    logDev('mock login', { email, tenant });
    return res;
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Unable to login' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const host = req.headers.get('host');
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res, host ?? undefined);
  return res;
}
