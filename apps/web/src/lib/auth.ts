import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { getTenantContextFromHeaders, parseTenantFromHost, type TenantContext } from './tenant';

const SESSION_COOKIE = 'aza8_session';
const COOKIE_MAX_AGE = 60 * 60 * 8; // 8 hours
const AUTH_MODE = (process.env.AUTH_MODE as 'mock' | 'oidc') ?? 'mock';

export type Session = {
  user: {
    email: string;
    name: string;
  };
  tenantKey: string;
  isHub: boolean;
};

const isDev = process.env.NODE_ENV !== 'production';

function getCookieDomain(host?: string | null) {
  const configured = process.env.COOKIE_DOMAIN;
  if (configured) return configured;
  if (!host) return undefined;
  if (host.includes('localhost') || host.startsWith('127.')) return undefined;
  const parts = host.split('.');
  if (parts.length >= 2) {
    return `.${parts.slice(-2).join('.')}`;
  }
  return undefined;
}

export function getSession(): Session | null {
  const raw = cookies().get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch (err) {
    console.warn('Invalid session cookie', err);
    return null;
  }
}

export function requireSession(returnUrl?: string): Session {
  const session = getSession();
  if (!session) {
    const target = '/login' + (returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : '');
    redirect(target);
  }
  return session;
}

export function buildSession(email: string, tenant: TenantContext): Session {
  return {
    user: {
      email,
      name: email.split('@')[0]
    },
    tenantKey: tenant.tenantKey,
    isHub: tenant.isHub
  };
}

export function setSessionCookie(res: NextResponse, session: Session, host?: string | null) {
  res.cookies.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: !isDev,
    path: '/',
    domain: getCookieDomain(host),
    maxAge: COOKIE_MAX_AGE
  });
}

export function clearSessionCookie(res: NextResponse, host?: string | null) {
  res.cookies.set(SESSION_COOKIE, '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    domain: getCookieDomain(host)
  });
}

export function authGuard(req: NextRequest): NextResponse | null {
  const { pathname } = req.nextUrl;
  const publicPaths = ['/login', '/api/auth/mock-login', '/api/auth/logout', '/favicon.ico', '/_next'];
  const isPublic = publicPaths.some((p) => pathname === p || pathname.startsWith(p));
  if (isPublic) return null;

  const raw = req.cookies.get(SESSION_COOKIE)?.value;
  if (!raw) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(url);
  }
  return null;
}

export function attachTenantHeaders(res: NextResponse, req: NextRequest) {
  const tenant = parseTenantFromHost(req.headers.get('host'));
  res.headers.set('x-tenant-key', tenant.tenantKey);
  res.headers.set('x-is-hub', tenant.isHub ? 'true' : 'false');
  return res;
}

export function logDev(message: string, meta?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[dev] ${message}`, meta ?? {});
  }
}

export function mockModeEnabled() {
  return AUTH_MODE === 'mock';
}

export function getReturnUrl() {
  const hdrs = headers();
  const ref = hdrs.get('referer');
  return ref ?? '/dashboard';
}
