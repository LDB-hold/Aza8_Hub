import { NextRequest, NextResponse } from 'next/server';
import { buildSession, clearSessionCookie, logDev, mockModeEnabled, setSessionCookie } from '@lib/auth';
import { parseTenantFromHost } from '@lib/tenant';

export async function POST(req: NextRequest) {
  if (!mockModeEnabled()) {
    return NextResponse.json({ error: 'Mock login disabled' }, { status: 400 });
  }
  const body = await req.json().catch(() => null) as { email?: string } | null;
  const email = body?.email;
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  const host = req.headers.get('host');
  const tenant = parseTenantFromHost(host);
  const session = buildSession(email, tenant);
  const res = NextResponse.json({ ok: true, session });
  setSessionCookie(res, session, host ?? undefined);
  logDev('mock login', { email, tenant });
  return res;
}

export async function GET(req: NextRequest) {
  // convenience login via query param
  const email = req.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }
  if (!mockModeEnabled()) {
    return NextResponse.json({ error: 'Mock login disabled' }, { status: 400 });
  }
  const host = req.headers.get('host');
  const tenant = parseTenantFromHost(host);
  const session = buildSession(email, tenant);
  const res = NextResponse.json({ ok: true, session });
  setSessionCookie(res, session, host ?? undefined);
  logDev('mock login', { email, tenant });
  return res;
}

export async function DELETE(req: NextRequest) {
  const host = req.headers.get('host');
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res, host ?? undefined);
  return res;
}
