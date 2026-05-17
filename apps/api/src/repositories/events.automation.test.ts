import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../db';
import { users, trips, itineraryEvents } from '../db/schema';
import { EventRepository } from './events';
import { eq, and } from 'drizzle-orm';

describe('Stay Lifecycle Automation (Repository)', () => {
  let userId: string;
  let tripId: string;
  const eventRepo = new EventRepository(db);

  beforeAll(async () => {
    const [user] = await db
      .insert(users)
      .values({ email: `auto_test_${Date.now()}@test.com`, provider: 'google' })
      .returning();
    userId = user!.id;
    const [trip] = await db
      .insert(trips)
      .values({ ownerId: userId, name: 'Auto Trip' })
      .returning();
    tripId = trip!.id;
  });

  afterAll(async () => {
    await db.delete(itineraryEvents).where(eq(itineraryEvents.tripId, tripId));
    await db.delete(trips).where(eq(trips.id, tripId));
    await db.delete(users).where(eq(users.id, userId));
  });

  it('should automatically create Check-in and Check-out activities when a Stay is created', async () => {
    const stay = await eventRepo.create({
      tripId,
      type: 'STAY',
      title: 'Grand Hotel',
      startTime: new Date('2026-06-01T15:00:00Z'),
      endTime: new Date('2026-06-02T11:00:00Z'),
    });

    const allEvents = await db
      .select()
      .from(itineraryEvents)
      .where(eq(itineraryEvents.tripId, tripId));

    // Total should be 3 (Stay + In + Out)
    expect(allEvents).toHaveLength(3);

    const checkin = allEvents.find((e) => e.type === 'CHECK_IN');
    const checkout = allEvents.find((e) => e.type === 'CHECK_OUT');

    expect(checkin?.parentStayId).toBe(stay.id);
    expect(checkin?.title).toContain('Grand Hotel');
    expect(checkin?.startTime.toISOString()).toBe(stay.startTime.toISOString());
    expect(checkout?.startTime.toISOString()).toBe(stay.endTime?.toISOString());
  });

  it('should synchronize Check-in/Out activities when the parent Stay is updated', async () => {
    const [stay] = await db
      .select()
      .from(itineraryEvents)
      .where(and(eq(itineraryEvents.tripId, tripId), eq(itineraryEvents.type, 'STAY')));

    const newTime = new Date('2026-06-01T16:00:00Z');
    await eventRepo.update(stay!.id, userId, { startTime: newTime, title: 'Updated Ritz' });

    const checkin = (
      await db
        .select()
        .from(itineraryEvents)
        .where(
          and(eq(itineraryEvents.parentStayId, stay!.id), eq(itineraryEvents.type, 'CHECK_IN')),
        )
    )[0];

    expect(checkin?.title).toContain('Updated Ritz');
    expect(checkin?.startTime.toISOString()).toBe(newTime.toISOString());
  });

  it('should perform a cascading delete of transition activities when the Stay is removed', async () => {
    const [stay] = await db
      .select()
      .from(itineraryEvents)
      .where(and(eq(itineraryEvents.tripId, tripId), eq(itineraryEvents.type, 'STAY')));

    await eventRepo.delete(stay!.id, userId);

    const remaining = await db
      .select()
      .from(itineraryEvents)
      .where(eq(itineraryEvents.tripId, tripId));
    expect(remaining).toHaveLength(0);
  });
});
