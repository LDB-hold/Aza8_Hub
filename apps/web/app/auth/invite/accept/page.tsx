'use client';

import { useState } from 'react';
import { apiFetch } from '../../../lib/api';

export default function AcceptInvitePage() {
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await apiFetch(`/portal/invites/accept/${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    setResult(JSON.stringify(res));
  };

  return (
    <div className="card">
      <h1>Accept invite</h1>
      <form onSubmit={onSubmit}>
        <input placeholder="token" value={token} onChange={(e) => setToken(e.target.value)} />
        <input placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button type="submit">Accept</button>
      </form>
      {result && <pre>{result}</pre>}
    </div>
  );
}
