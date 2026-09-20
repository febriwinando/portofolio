import 'dotenv/config';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { profile, projects } from '../src/db/schema';

const client = postgres(process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/nara');
const db = drizzle(client);

await db.insert(profile).values({
  name: 'Febri Winando',
  role: 'Application Developer',
  bio: 'I design and build dependable web applications that turn complex workflows into useful, human experiences.',
  location: 'Indonesia · Open to remote',
  email: 'hello@febriwinando.dev',
  avatarUrl: 'https://github.com/febriwinando.png',
  githubUsername: 'febriwinando',
  githubUrl: 'https://github.com/febriwinando',
}).onConflictDoNothing();

await db.insert(projects).values([
  { title: 'Kindred House', slug: 'kindred-house', description: 'A hospitality brand built around quiet rituals.', year: '2024' },
  { title: 'Morrow Objects', slug: 'morrow-objects', description: 'A digital home for useful, beautiful things.', year: '2023' },
  { title: 'Field Notes', slug: 'field-notes', description: 'An editorial identity for curious minds.', year: '2023' },
]).onConflictDoNothing();
await client.end();
console.log('Seeded portfolio projects.');
