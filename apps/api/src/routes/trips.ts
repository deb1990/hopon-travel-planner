import { Hono } from 'hono';
import { db } from '../db';
import { trips } from '../db/schema';

const tripsRouter = new Hono();

/**
 * List all trips
 */
tripsRouter.get('/', async (c) => {
  try {
    const allTrips = await db.select().from(trips);
    return c.json(allTrips);
  } catch (error) {
    console.error('Failed to fetch trips:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

export { tripsRouter };
