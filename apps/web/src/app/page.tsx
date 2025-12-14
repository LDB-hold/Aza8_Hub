import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { parseTenantFromHost } from '../lib/tenant';

export default function HomePage() {
  const hdrs = headers();
  const host = hdrs.get('host');
  const { isHub } = parseTenantFromHost(host);
  redirect(isHub ? '/hub/dashboard' : '/dashboard');
}
