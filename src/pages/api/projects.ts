import type { APIRoute } from 'astro';
import { desc } from 'drizzle-orm';
import { db } from '../../db/client';
import { projects } from '../../db/schema';

const fallbackProjects = [
  { title: 'Kindred House', slug: 'kindred-house', description: 'A hospitality brand built around quiet rituals.', year: '2024', imageUrl: null },
  { title: 'Morrow Objects', slug: 'morrow-objects', description: 'A digital home for useful, beautiful things.', year: '2023', imageUrl: null },
  { title: 'Field Notes', slug: 'field-notes', description: 'An editorial identity for curious minds.', year: '2023', imageUrl: null },
];

export const GET: APIRoute = async () => {
  if (!db) return new Response(JSON.stringify(fallbackProjects), { headers: { 'content-type': 'application/json' } });
  const records = await db.select().from(projects).orderBy(desc(projects.createdAt));
  return new Response(JSON.stringify(records), { headers: { 'content-type': 'application/json' } });
};
