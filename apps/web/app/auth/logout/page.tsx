'use client';

import { useEffect } from 'react';
import { apiFetch } from '../../lib/api';

export default function LogoutPage() {
  useEffect(() => {
    apiFetch('/auth/logout', { method: 'POST' }).finally(() => {
      window.location.href = '/auth/login';
    });
  }, []);

  return <div className="card">Saindo...</div>;
}
