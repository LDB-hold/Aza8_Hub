export const createCookieTokenProvider = (cookieName = 'aza8_token') => () => {
  if (typeof document === 'undefined') {
    return null;
  }

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === cookieName) {
      return decodeURIComponent(value);
    }
  }

  return null;
};
