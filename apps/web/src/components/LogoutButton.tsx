'use client';

import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const onLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };
  return (
    <Button variant="outline" size="sm" className={cn(className)} onClick={onLogout}>
      Logout
    </Button>
  );
}
