'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchMe } from '../lib/api';
import { toolEnabledForTenant } from '../lib/navigation';
import { getHostParts } from '../lib/tenant';

export function PageFrame({
  title,
  description,
  permissions,
  toolKey,
  children
}: {
  title: string;
  description: string;
  permissions: string[];
  toolKey?: string;
  children?: React.ReactNode;
}) {
  const [allowed, setAllowed] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const { slug } = getHostParts();
    if (toolKey && !toolEnabledForTenant(slug, toolKey as any)) {
      setAllowed(false);
      router.push('/404');
      return;
    }
    fetchMe().then((me) => {
      if (!me) {
        setAllowed(false);
        router.push('/auth/login');
        return;
      }
      const hasAll = permissions.every((p) => me.permissions.includes(p));
      if (!hasAll) {
        setAllowed(false);
        router.push('/403');
      } else {
        setAllowed(true);
      }
    });
  }, [permissions, router]);

  if (!allowed) {
    return null;
  }

  return (
    <div className="card">
      <h1>{title}</h1>
      <p>{description}</p>
      <div>
        <strong>Required permissions:</strong>
        <ul data-testid="required-permissions">
          {permissions.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
      {children}
    </div>
  );
}
