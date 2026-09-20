import { createHmac, timingSafeEqual } from 'node:crypto';

export const SESSION_COOKIE = 'portfolio_session';
const sessionMaxAge = 60 * 60 * 24 * 7;

function secret() {
  return import.meta.env.AUTH_SECRET ?? 'replace-this-auth-secret';
}

export function credentials() {
  return {
    username: import.meta.env.ADMIN_USERNAME ?? 'elzio',
    email: import.meta.env.ADMIN_EMAIL ?? 'admin@example.com',
    password: import.meta.env.ADMIN_PASSWORD ?? '1ndonesi4',
  };
}

function signature(payload: string) {
  return createHmac('sha256', secret()).update(payload).digest('hex');
}

export function createSession(email: string) {
  const payload = Buffer.from(JSON.stringify({ email, expiresAt: Date.now() + sessionMaxAge * 1000 })).toString('base64url');
  return `${payload}.${signature(payload)}`;
}

export function isValidSession(value: string | undefined) {
  if (!value) return false;
  const [payload, providedSignature] = value.split('.');
  if (!payload || !providedSignature) return false;
  const expectedSignature = signature(payload);
  if (providedSignature.length !== expectedSignature.length) return false;
  if (!timingSafeEqual(Buffer.from(providedSignature), Buffer.from(expectedSignature))) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString()) as { email: string; expiresAt: number };
    return Boolean(session.email && session.expiresAt > Date.now());
  } catch {
    return false;
  }
}

export function sessionCookie(value: string, maxAge = sessionMaxAge) {
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${import.meta.env.PROD ? '; Secure' : ''}`;
}

export function clearSessionCookie() {
  return sessionCookie('', 0);
}

export function isAuthenticated(request: Request) {
  const cookie = request.headers.get('cookie')?.match(new RegExp(`${SESSION_COOKIE}=([^;]+)`))?.[1];
  return isValidSession(cookie);
}
