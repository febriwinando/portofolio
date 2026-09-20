import type { APIRoute } from 'astro';
import { credentials, isAuthenticated } from '../../../lib/auth';

export const GET: APIRoute = ({ request }) => {
  if (!isAuthenticated(request)) return new Response(JSON.stringify({ authenticated: false }), { status: 401, headers: { 'content-type': 'application/json' } });
  return new Response(JSON.stringify({ authenticated: true, email: credentials().email }), { headers: { 'content-type': 'application/json' } });
};
