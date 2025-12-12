import * as React from 'react';
import { cn } from '@lib/utils';

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('rounded-xl border border-slate-200 bg-white shadow-sm', className)} {...props} />
));
Card.displayName = 'Card';

export const CardHeader = ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-5 pb-3', className)}>{children}</div>
);

export const CardTitle = ({ children, className }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-base font-semibold text-slate-900', className)}>{children}</p>
);

export const CardDescription = ({ children, className }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-slate-600', className)}>{children}</p>
);

export const CardContent = ({ children, className }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('p-5 pt-0', className)}>{children}</div>
);
