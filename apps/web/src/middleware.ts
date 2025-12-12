import { NextRequest, NextResponse } from 'next/server';
import { attachTenantHeaders, authGuard, logDev } from './lib/auth';

export function middleware(req: NextRequest) {
  logDev('middleware', { path: req.nextUrl.pathname, host: req.headers.get('host') });
  const guard = authGuard(req);
  if (guard) return guard;

  const res = NextResponse.next();
  return attachTenantHeaders(res, req);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
