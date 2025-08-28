import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;

// Development connection
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

// For serverless environments
export const getDb = () => {
  const client = postgres(connectionString);
  return drizzle(client, { schema });
};