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
        visibility: 'private',
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

    const fetchedEvents = await repo.findByTripId(tripId, userId);
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

    const updated = await repo.update(event.id, userId, {
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

    await repo.delete(event.id, userId);

    const fetched = await repo.findByTripId(tripId, userId);
    expect(fetched.find((e) => e.id === event.id)).toBeUndefined();
  });

  it('should prevent an unauthorized user from viewing a private trip', async () => {
    const [userB] = await db
      .insert(users)
      .values({
        email: `hacker_${Date.now()}@example.com`,
        provider: 'apple',
      })
      .returning();
    const userBId = userB!.id;

    const repo = new EventRepository(db);

    const results = await repo.findByTripId(tripId, userBId);
    expect(results).toHaveLength(0);

    await db.delete(users).where(eq(users.id, userBId));
  });

  it('should prevent an unauthorized user from updating an event', async () => {
    const [userB] = await db
      .insert(users)
      .values({
        email: `hacker_upd_${Date.now()}@example.com`,
        provider: 'apple',
      })
      .returning();
    const userBId = userB!.id;

    const repo = new EventRepository(db);
    const event = await repo.create({
      tripId,
      type: 'ACTIVITY',
      title: 'Secret Meeting',
      startTime: new Date(),
    });

    await expect(repo.update(event.id, userBId, { title: 'Pwned' })).rejects.toThrow(
      'Event not found or unauthorized',
    );

    await repo.delete(event.id, userId);
    await db.delete(users).where(eq(users.id, userBId));
  });
});
