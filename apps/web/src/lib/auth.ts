import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { type CurrentUserContext } from '@aza8/core-domain';
import { getTenantContextFromHeaders, parseTenantFromHost } from './tenant';
import { apiBaseUrl } from './config';

const SESSION_COOKIE = 'session';
const isDev = process.env.NODE_ENV !== 'production';

export type Session = CurrentUserContext;

const publicPaths = ['/login', '/api/auth/mock-login', '/api/auth/logout', '/api/auth/login', '/favicon.ico', '/_next'];

export async function fetchCurrentUser(tenantSlug?: string): Promise<CurrentUserContext | null> {
  const cookieStore = cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  if (!session) return null;

  const headersInit: HeadersInit = {
    cookie: `${SESSION_COOKIE}=${session}`
  };
  if (tenantSlug && tenantSlug !== 'hub') {
    headersInit['x-tenant-slug'] = tenantSlug;
  }

  const res = await fetch(`${apiBaseUrl}/auth/me`, {
    method: 'GET',
    headers: headersInit,
    cache: 'no-store'
  });

  if (!res.ok) {
    return null;
  }

  return (await res.json()) as CurrentUserContext;
}

export async function requireSession(returnUrl?: string): Promise<CurrentUserContext> {
  const tenant = getTenantContextFromHeaders();
  const user = await fetchCurrentUser(tenant.tenantKey);
  if (!user) {
    const target = '/login' + (returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : '');
    redirect(target);
  }
  return user;
}

export function authGuard(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl;
  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(p));
  if (isPublic) return null;

  const hasSession = req.cookies.has(SESSION_COOKIE);
  if (!hasSession) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(url);
  }
  return null;
}

export function attachTenantHeaders(res: NextResponse, req: NextRequest) {
  const tenant = parseTenantFromHost(req.headers.get('host'));
  res.headers.set('x-tenant-slug', tenant.tenantKey);
  res.headers.set('x-tenant-key', tenant.tenantKey);
  res.headers.set('x-is-hub', tenant.isHub ? 'true' : 'false');
  return res;
}

export function clearSessionCookie(res: NextResponse, host?: string | null) {
  res.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    domain: getCookieDomain(host)
  });
}

function getCookieDomain(host?: string | null) {
  if (!host) return undefined;
  if (host.includes('localhost') || host.startsWith('127.')) return undefined;
  const parts = host.split('.');
  if (parts.length >= 2) {
    return `.${parts.slice(-2).join('.')}`;
  }
  return undefined;
}

export function logDev(message: string, meta?: Record<string, unknown>) {
  if (isDev) {
    console.log(`[dev] ${message}`, meta ?? {});
  }
}
