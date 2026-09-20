import type { APIRoute } from 'astro';
import { db } from '../../db/client';
import { messages } from '../../db/schema';

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get('content-type') ?? '';
  const data = contentType.includes('application/json') ? await request.json() : Object.fromEntries(await request.formData());
  const name = String(data.name ?? '').trim();
  const email = String(data.email ?? '').trim();
  const message = String(data.message ?? '').trim();

  if (!name || !email || !message || !email.includes('@')) {
    return new Response(JSON.stringify({ error: 'Please complete all fields with a valid email.' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }
  if (!db) return new Response(JSON.stringify({ ok: true, stored: false, message: 'Database is not configured yet.' }), { status: 202, headers: { 'content-type': 'application/json' } });
  await db.insert(messages).values({ name, email, message });
  if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) return redirect('/?sent=1#contact', 303);
  return new Response(JSON.stringify({ ok: true, stored: true }), { status: 201, headers: { 'content-type': 'application/json' } });
};
