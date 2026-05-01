import { Hono } from 'hono';
import { shiftEvents, ItineraryEvent } from '@hopon/core';
import { db } from '../db';
import { TripRepository } from '../repositories/trips';
import { EventRepository } from '../repositories/events';

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
    // 1. Fetch current events (This also verifies read access)
    const currentEvents = await eventRepo.findByTripId(tripId, userId);

    if (currentEvents.length === 0) {
      return c.json({ count: 0, message: 'No events to shift' });
    }

    // 2. Map DB events to Core types for shifting
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

    // 3. Shift them using pure temporal logic
    const shifted = shiftEvents(coreEvents, offsetMs);

    // 4. Update them back to DB
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
