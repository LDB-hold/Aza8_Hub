'use client';

import { useState } from 'react';
import { quickLogin } from '../../lib/api';
import { getHostParts } from '../../lib/tenant';

const HUB_USERS = ['aza8_admin@aza8.com', 'aza8_support@aza8.com'];
const PORTAL_USERS = [
  'owner.alpha@client.com',
  'manager.alpha@client.com',
  'member.alpha@client.com',
  'supplier.alpha@client.com',
  'owner.beta@client.com',
  'member.beta@client.com'
];

export default function LoginPage() {
  const { isHub } = getHostParts();
  const options = isHub ? HUB_USERS : PORTAL_USERS;
  const [email, setEmail] = useState(options[0]);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await quickLogin(email);
      window.location.href = isHub ? '/hub/dashboard' : '/app/dashboard';
    } catch (err) {
      setError('Login failed');
      console.error(err);
    }
  };

  return (
    <div className="card">
      <h1 data-testid="login-title">Quick login</h1>
      <p>Escolha um usuário seed para testar.</p>
      <form onSubmit={onSubmit}>
        <select value={email} onChange={(e) => setEmail(e.target.value)} data-testid="login-select">
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        <div style={{ marginTop: 12 }}>
          <button type="submit" data-testid="login-submit">
            Login
          </button>
        </div>
        {error && <div data-testid="login-error">{error}</div>}
      </form>
    </div>
  );
}
