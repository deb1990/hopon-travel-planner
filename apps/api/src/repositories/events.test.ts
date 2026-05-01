import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../db';
import { users, trips, itineraryEvents } from '../db/schema';
import { EventRepository } from './events';
import { eq } from 'drizzle-orm';

describe('EventRepository', () => {
  let userId: string;
  let tripId: string;

  beforeAll(async () => {
    // Setup: Create a test user and trip
    const [user] = await db
      .insert(users)
      .values({
        email: 'test@example.com',
        provider: 'google',
      })
      .returning();
    userId = user!.id;

    const [trip] = await db
      .insert(trips)
      .values({
        ownerId: userId,
        name: 'Test Trip',
      })
      .returning();
    tripId = trip!.id;
  });

  afterAll(async () => {
    // Cleanup
    await db.delete(itineraryEvents).where(eq(itineraryEvents.tripId, tripId));
    await db.delete(trips).where(eq(trips.id, tripId));
    await db.delete(users).where(eq(users.id, userId));
  });

  it('should create and retrieve an itinerary event', async () => {
    const repo = new EventRepository(db);

    const newEvent = await repo.create({
      tripId,
      type: 'STAY',
      title: 'Test Hotel',
      startTime: new Date('2026-10-01T15:00:00Z'),
    });

    expect(newEvent.id).toBeDefined();
    expect(newEvent.title).toBe('Test Hotel');

    const fetchedEvents = await repo.findByTripId(tripId);
    expect(fetchedEvents).toHaveLength(1);
    expect(fetchedEvents[0]!.title).toBe('Test Hotel');
  });

  it('should update an itinerary event', async () => {
    const repo = new EventRepository(db);

    const event = await repo.create({
      tripId,
      type: 'ACTIVITY',
      title: 'Lunch',
      startTime: new Date('2026-10-02T12:00:00Z'),
    });

    const updated = await repo.update(event.id, {
      title: 'Fancy Lunch',
      isLocked: true,
    });

    expect(updated.title).toBe('Fancy Lunch');
    expect(updated.isLocked).toBe(true);
  });

  it('should delete an itinerary event', async () => {
    const repo = new EventRepository(db);

    const event = await repo.create({
      tripId,
      type: 'TRAVEL',
      title: 'Flight',
      startTime: new Date('2026-10-03T10:00:00Z'),
    });

    await repo.delete(event.id);

    const fetched = await repo.findByTripId(tripId);
    expect(fetched.find((e) => e.id === event.id)).toBeUndefined();
  });
});
