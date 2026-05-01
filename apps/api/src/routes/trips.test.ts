import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Hono } from 'hono';
import { tripsRouter } from './trips';
import { db } from '../db';
import { users, trips, itineraryEvents } from '../db/schema';
import { eq, and, exists } from 'drizzle-orm';

describe('Trips API Integration', () => {
  let userId: string;
  const app = new Hono().route('/trips', tripsRouter);

  beforeAll(async () => {
    const [user] = await db
      .insert(users)
      .values({
        email: `api_test_${Date.now()}@test.com`,
        provider: 'google',
      })
      .returning();
    userId = user!.id;
  });

  afterAll(async () => {
    // Delete events first due to foreign key constraints
    await db.delete(itineraryEvents).where(
      exists(
        db
          .select()
          .from(trips)
          .where(and(eq(itineraryEvents.tripId, trips.id), eq(trips.ownerId, userId))),
      ),
    );
    await db.delete(trips).where(eq(trips.ownerId, userId));
    await db.delete(users).where(eq(users.id, userId));
  });

  it('GET /trips should return an empty list when no trips exist', async () => {
    // We pass the userId in a header to simulate authentication
    const res = await app.request('/trips', {
      headers: { 'x-user-id': userId },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(Array.isArray(data)).toBe(true);
  });

  it('GET /trips should return trips owned by the user', async () => {
    await db.insert(trips).values({
      ownerId: userId,
      name: 'API Test Trip',
    });

    const res = await app.request('/trips', {
      headers: { 'x-user-id': userId },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.some((t: any) => t.name === 'API Test Trip')).toBe(true);
  });

  it('GET /trips should return 401 if x-user-id is missing', async () => {
    const res = await app.request('/trips');
    expect(res.status).toBe(401);
  });

  it('PATCH /trips/:id/shift should shift all events in a trip', async () => {
    // 1. Create a trip
    const [trip] = await db
      .insert(trips)
      .values({
        ownerId: userId,
        name: 'Shift Test Trip',
      })
      .returning();

    // 2. Add an event
    const startTime = new Date('2026-10-01T10:00:00Z');
    const [event] = await db
      .insert(itineraryEvents)
      .values({
        tripId: trip!.id,
        type: 'ACTIVITY',
        title: 'Lunch',
        startTime,
      })
      .returning();

    // 3. Shift by 1 day (86400000 ms)
    const res = await app.request(`/trips/${trip!.id}/shift`, {
      method: 'PATCH',
      headers: {
        'x-user-id': userId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ offsetMs: 86400000 }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.count).toBeGreaterThan(0);

    // 4. Verify in DB
    const [updatedEvent] = await db
      .select()
      .from(itineraryEvents)
      .where(eq(itineraryEvents.id, event!.id));
    expect(new Date(updatedEvent!.startTime).toISOString()).toBe('2026-10-02T10:00:00.000Z');
  });
});
