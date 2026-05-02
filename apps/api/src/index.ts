import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { tripsRouter } from './routes/trips';

const app = new Hono();

app.use('*', logger());
app.use('*', cors());

/**
 * Global Error Handler
 */
app.onError((err, c) => {
  console.error(`[API ERROR] ${err.message}`, err);
  return c.json(
    {
      error: 'Internal Server Error',
      message: process.env['NODE_ENV'] === 'development' ? err.message : undefined,
    },
    500,
  );
});

app.route('/trips', tripsRouter);

console.log('Registered Routes:');
app.routes.forEach((r) => console.log(`- ${r.method} ${r.path}`));

app.get('/', (c) => {
  return c.json({
    message: 'Hop On API',
    status: 'online',
  });
});

const port = 4001;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
