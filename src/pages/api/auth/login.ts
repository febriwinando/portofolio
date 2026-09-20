import type { APIRoute } from 'astro';
import { createSession, credentials, sessionCookie } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const username = String(form.get('username') ?? '').trim().toLowerCase();
  const password = String(form.get('password') ?? '');
  const account = credentials();

  if (username !== account.username.toLowerCase() || password !== account.password) {
    return redirect('/login?error=invalid', 303);
  }

  return new Response(null, { status: 303, headers: { Location: '/admin', 'Set-Cookie': sessionCookie(createSession(account.username)) } });
};
