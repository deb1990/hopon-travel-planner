import { defineConfig } from 'drizzle-kit';

console.log('Using DB URL:', process.env['DATABASE_URL']);

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env['DATABASE_URL'] || 'postgres://hopon:hopon@localhost:5432/hopon',
  },
});
