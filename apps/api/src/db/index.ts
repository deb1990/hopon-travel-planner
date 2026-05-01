import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';
import * as schema from './schema';

dotenv.config();

const connectionString =
  process.env['DATABASE_URL'] || 'postgres://hopon:hopon_password@localhost:5432/hopon';
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
