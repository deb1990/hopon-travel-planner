import { Hono } from 'hono';
import { shiftEvents, ItineraryEvent } from '@hopon/core';
import { db } from '../db';
import { TripRepository } from '../repositories/trips';
import { EventRepository } from '../repositories/events';
import { trips } from '../db/schema';
import { eq } from 'drizzle-orm';

type Bindings = {
  // Add environment variables here if needed
};

type Variables = {
  userId: string;
};

const tripsRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>();
const tripRepo = new TripRepository(db);
const eventRepo = new EventRepository(db);

/**
 * Middleware to extract userId from headers (Mock Auth)
 */
tripsRouter.use('*', async (c, next) => {
  const userId = c.req.header('x-user-id');
  if (!userId) {
    return c.json({ error: 'Unauthorized', message: 'Missing x-user-id header' }, 401);
  }
  c.set('userId', userId);
  return await next();
});

/**
 * List all trips accessible to the user
 */
tripsRouter.get('/', async (c) => {
  try {
    const userId = c.get('userId');
    const accessibleTrips = await tripRepo.findAccessibleByUserId(userId);
    return c.json(accessibleTrips);
  } catch (error) {
    console.error('Failed to fetch trips:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

/**
 * Create a new trip
 */
tripsRouter.post('/', async (c) => {
  const userId = c.get('userId');
  const { name, startDate, endDate } = await c.req.json<{
    name: string;
    startDate?: string;
    endDate?: string;
  }>();

  try {
    const newTrip = await tripRepo.create({
      ownerId: userId,
      name: name || 'Untitled Journey',
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    });
    return c.json(newTrip, 201);
  } catch (error) {
    console.error('Failed to create trip:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

/**
 * Get a single trip with its events
 */
tripsRouter.get('/:id', async (c) => {
  const tripId = c.req.param('id');
  const userId = c.get('userId');

  try {
    // 1. Get trip details
    const [trip] = await db.select().from(trips).where(eq(trips.id, tripId));
    if (!trip) return c.json({ error: 'Not Found' }, 404);

    // 2. Check permission (simple check for now, can use tripRepo later)
    const role = await tripRepo.getUserRole(tripId, userId);
    if (!role && trip.visibility !== 'public') {
      return c.json({ error: 'Unauthorized' }, 403);
    }

    // 3. Get events
    const events = await eventRepo.findByTripId(tripId, userId);

    return c.json({
      ...trip,
      events,
    });
  } catch (error) {
    console.error('Failed to fetch trip:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

/**
 * Add a new event to a trip
 */
tripsRouter.post('/:id/events', async (c) => {
  const tripId = c.req.param('id');
  const userId = c.get('userId');
  const body = (await c.req.json()) as Record<string, unknown>;

  try {
    // 1. Check write permission
    const role = await tripRepo.getUserRole(tripId, userId);
    if (role !== 'owner' && role !== 'editor') {
      return c.json({ error: 'Unauthorized', message: 'Insufficient permissions' }, 403);
    }

    // 2. Create event
    const newEvent = await eventRepo.create({
      ...(body as Record<string, unknown>), // Cast specifically for spread to schema
      tripId,
      startTime: new Date(body['startTime'] as string),
      endTime: body['endTime'] ? new Date(body['endTime'] as string) : null,
    } as unknown as Parameters<typeof eventRepo.create>[0]); // Safe cast to the repo's expected type

    return c.json(newEvent, 201);
  } catch (error) {
    console.error('Failed to create event:', error);
    return c.json({ error: 'Internal Server Error' }, 500);
  }
});

/**
 * Delete a trip
 */
tripsRouter.delete('/:id', async (c) => {
  const tripId = c.req.param('id');
  const userId = c.get('userId');

  try {
    const result = await tripRepo.delete(tripId, userId);
    return c.json(result);
  } catch (error) {
    console.error('Failed to delete trip:', error);
    return c.json(
      {
        error: 'Unauthorized or Not Found',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      403,
    );
  }
});

/**
 * Shift all events in a trip by a given offset
 */
tripsRouter.patch('/:id/shift', async (c) => {
  const tripId = c.req.param('id');
  const userId = c.get('userId');
  const { offsetMs } = await c.req.json<{ offsetMs: number }>();

  if (typeof offsetMs !== 'number') {
    return c.json({ error: 'Bad Request', message: 'offsetMs must be a number' }, 400);
  }

  try {
    const currentEvents = await eventRepo.findByTripId(tripId, userId);

    if (currentEvents.length === 0) {
      return c.json({ count: 0, message: 'No events to shift' });
    }

    const coreEvents: ItineraryEvent[] = currentEvents.map((e) => ({
      id: e.id,
      tripId: e.tripId,
      type: e.type,
      title: e.title,
      startTime: e.startTime.toISOString(),
      endTime: e.endTime?.toISOString(),
      locationName: e.locationName ?? undefined,
      coords: e.lat && e.lng ? [e.lat, e.lng] : undefined,
      bookingLink: e.bookingLink ?? undefined,
      notes: e.notes ?? undefined,
      isLocked: e.isLocked,
    }));

    const shifted = shiftEvents(coreEvents, offsetMs);

    const updates = shifted.map((e) =>
      eventRepo.update(e.id, userId, {
        startTime: new Date(e.startTime),
        endTime: e.endTime ? new Date(e.endTime) : null,
      }),
    );

    await Promise.all(updates);

    return c.json({
      success: true,
      count: shifted.length,
      message: `Shifted ${shifted.length} events by ${offsetMs}ms`,
    });
  } catch (error) {
    console.error('Failed to shift trip:', error);
    return c.json(
      {
        error: 'Unauthorized or Not Found',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      403,
    );
  }
});

export { tripsRouter };
