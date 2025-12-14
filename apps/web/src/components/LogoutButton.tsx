'use client';

import { useRouter } from 'next/navigation';
import { Button, type ButtonProps } from './ui/button';
import { cn } from '../lib/utils';

type LogoutButtonProps = {
  className?: string;
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
};

export function LogoutButton({ className, variant = 'outline', size = 'sm' }: LogoutButtonProps) {
  const router = useRouter();
  const onLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };
  return (
    <Button variant={variant} size={size} className={cn(className)} onClick={onLogout}>
      Logout
    </Button>
  );
}
