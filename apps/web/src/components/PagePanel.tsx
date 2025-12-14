import type { ReactNode } from 'react';
import { cn } from '@lib/utils';

type PagePanelProps = {
  title: string;
  description: string;
  icon: string;
  helper?: string;
  children?: ReactNode;
  testId?: string;
  tone?: 'default' | 'dashed';
};

export function PagePanel({
  title,
  description,
  icon,
  helper,
  children,
  testId,
  tone = 'default'
}: PagePanelProps) {
  return (
    <section
      className={cn(
        'rounded-[24px] bg-white/90 p-5 shadow-[0_16px_44px_-34px_rgba(28,27,31,0.3)]',
        tone === 'dashed' ? 'border border-dashed border-[#E6E0E9]' : 'border border-[#E6E0E9]'
      )}
      data-testid={testId}
    >
      <div className="flex items-start gap-3">
        <span className="material-symbols-rounded mt-0.5 text-xl text-[#6750A4]" aria-hidden>
          {icon}
        </span>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#49454F]">{helper ?? 'Visão MD3'}</p>
          <h2 className="text-lg font-semibold text-[#1C1B1F]">{title}</h2>
          <p className="text-sm text-[#49454F]">{description}</p>
        </div>
      </div>
      {children ? <div className="mt-3 text-sm text-[#49454F]">{children}</div> : null}
    </section>
  );
}
