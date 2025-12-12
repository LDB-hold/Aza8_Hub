# Aza8 Hub – Web

## Getting started

```bash
pnpm install
pnpm --filter @aza8/web dev
```

## Environment

Copy `.env.example` to `.env.local` and adjust values.

Key vars:
- `NEXT_PUBLIC_APP_ENV` – environment name
- `AUTH_MODE` – `mock` or `oidc` (mock enables cookie login)
- `AZA8_AUTH_ISSUER`, `AZA8_AUTH_CLIENT_ID`, `AZA8_AUTH_REDIRECT_URI` – placeholders for future SSO
- `COOKIE_DOMAIN` – default `.aza8.com.br`

## Local host mapping

Add to `/etc/hosts` for subdomain testing:

```
127.0.0.1 hub.localhost
127.0.0.1 acme.localhost
```

Then access:
- Hub: http://hub.localhost:3000
- Tenant portal: http://acme.localhost:3000

## Notes
- Tenancy is derived from the request host via middleware and sent to server components through headers.
- Mock login uses a session cookie; logout clears it.
- Dashboard and other app routes are protected; unauthenticated users are redirected to `/login` with returnUrl.
