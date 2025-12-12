import { Badge } from './ui/badge';

export function TenantBadge({ tenantKey, isHub }: { tenantKey: string; isHub: boolean }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-600">
      <Badge variant={isHub ? 'accent' : 'default'}>{isHub ? 'Hub' : 'Portal'}</Badge>
      <span className="font-semibold text-slate-800">{tenantKey}</span>
    </div>
  );
}
