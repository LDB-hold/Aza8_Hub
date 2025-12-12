export const getHostParts = () => {
  if (typeof window === 'undefined') {
    return { host: 'localhost', slug: null, isHub: true };
  }
  const host = window.location.hostname;
  const params = new URLSearchParams(window.location.search);
  const forcedSlug = params.get('tenant');
  const pathname = window.location.pathname;
  const isHubPath = pathname.startsWith('/hub');

  // Dev helper: allow ?tenant=alpha when on localhost to resolve portal
  if ((host === 'localhost' || host === '127.0.0.1') && forcedSlug && !isHubPath) {
    return { host, slug: forcedSlug, isHub: false };
  }

  const isHub =
    isHubPath || host.startsWith('hub.') || host === 'hub.localhost' || host === 'localhost' || host === '127.0.0.1';
  const slug = isHub ? forcedSlug ?? null : host.split('.')[0] ?? null;
  return { host, slug, isHub };
};
