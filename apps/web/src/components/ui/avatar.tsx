import * as React from 'react';
import { cn } from '@lib/utils';

export function Avatar({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className={cn('h-9 w-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-sm font-semibold', className)}>
      {initials || 'A'}
    </div>
  );
}
