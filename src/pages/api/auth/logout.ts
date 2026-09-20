import type { APIRoute } from 'astro';
import { clearSessionCookie } from '../../../lib/auth';

export const POST: APIRoute = async ({ redirect }) => new Response(null, { status: 303, headers: { Location: '/', 'Set-Cookie': clearSessionCookie() } });
