import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { db } from '../../db/client';
import { profile } from '../../db/schema';
import { isAuthenticated } from '../../lib/auth';

const fallbackProfile = {
  name: 'Febri Winando',
  role: 'Application Developer',
  bio: 'I design and build dependable web applications that turn complex workflows into useful, human experiences.',
  location: 'Indonesia · Open to remote',
  email: 'hello@febriwinando.dev',
  avatarUrl: 'https://github.com/febriwinando.png',
  githubUsername: 'febriwinando',
  githubUrl: 'https://github.com/febriwinando',
};

async function githubProfile(username: string) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`, { headers: { Accept: 'application/vnd.github+json' } });
    if (!response.ok) return null;
    const github = await response.json();
    return { avatarUrl: github.avatar_url, githubName: github.name, githubBio: github.bio, publicRepos: github.public_repos, followers: github.followers, githubUrl: github.html_url };
  } catch {
    return null;
  }
}

export const GET: APIRoute = async () => {
  const saved = db ? (await db.select().from(profile).limit(1))[0] : undefined;
  const base = saved ?? fallbackProfile;
  const github = await githubProfile(base.githubUsername);
  return new Response(JSON.stringify({ ...base, github }), { headers: { 'content-type': 'application/json' } });
};

export const PUT: APIRoute = async ({ request }) => {
  const adminToken = import.meta.env.PROFILE_ADMIN_TOKEN;
  const legacyTokenValid = Boolean(adminToken && request.headers.get('authorization') === `Bearer ${adminToken}`);
  if (!isAuthenticated(request) && !legacyTokenValid) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'content-type': 'application/json' } });
  if (!db) return new Response(JSON.stringify({ error: 'DATABASE_URL is not configured.' }), { status: 503, headers: { 'content-type': 'application/json' } });
  const body = await request.json();
  const values = { name: String(body.name ?? '').trim(), role: String(body.role ?? '').trim(), bio: String(body.bio ?? '').trim(), location: String(body.location ?? '').trim(), email: String(body.email ?? '').trim(), avatarUrl: String(body.avatarUrl ?? '').trim() || null, githubUsername: String(body.githubUsername ?? 'febriwinando').trim(), githubUrl: `https://github.com/${String(body.githubUsername ?? 'febriwinando').trim()}`, updatedAt: new Date() };
  if (!values.name || !values.role || !values.bio || !values.location || !values.email || !values.githubUsername) return new Response(JSON.stringify({ error: 'name, role, bio, location, email, and githubUsername are required.' }), { status: 400, headers: { 'content-type': 'application/json' } });
  const existing = (await db.select({ id: profile.id }).from(profile).limit(1))[0];
  const saved = existing ? await db.update(profile).set(values).where(eq(profile.id, existing.id)).returning() : await db.insert(profile).values(values).returning();
  return new Response(JSON.stringify(saved[0]), { status: 200, headers: { 'content-type': 'application/json' } });
};