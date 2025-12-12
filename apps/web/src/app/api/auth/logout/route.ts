import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@lib/auth';

export async function POST(req: NextRequest) {
  const host = req.headers.get('host');
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res, host ?? undefined);
  return res;
}
