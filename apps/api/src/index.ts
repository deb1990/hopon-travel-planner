import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { tripsRouter } from './routes/trips';

const app = new Hono();

app.use('*', logger());

app.route('/trips', tripsRouter);

app.get('/', (c) => {
  return c.json({
    message: 'Hop On API',
    status: 'online',
  });
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
