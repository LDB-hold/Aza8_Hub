import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default function HomePage() {
  const host = headers().get('host') ?? 'localhost';
  const isHub = host.startsWith('hub') || host === 'localhost' || host === '127.0.0.1';
  const slug = isHub ? null : host.split('.')[0];
  if (isHub) {
    redirect('/hub/dashboard');
  }
  if (slug) {
    redirect('/app/dashboard');
  }
  redirect('/auth/login');
}
