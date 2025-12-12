import { AppShell } from '@components/AppShell';
import { requireSession } from '@lib/auth';
import { getTenantContextFromHeaders } from '@lib/tenant';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const tenant = getTenantContextFromHeaders();
  const session = requireSession();

  return <AppShell session={session} tenant={tenant}>{children}</AppShell>;
}
