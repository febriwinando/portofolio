import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = import.meta.env.DATABASE_URL;

export const db = connectionString
  ? drizzle(postgres(connectionString, { max: 1 }), { schema })
  : null;
