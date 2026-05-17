import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Hono } from 'hono';
import { tripsRouter } from './trips';
import { db } from '../db';
import { users, trips, itineraryEvents } from '../db/schema';
import { eq, and, exists } from 'drizzle-orm';
import { Trip } from '@hopon/core';

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
    expect(data.some((t: Trip) => t.name === 'API Test Trip')).toBe(true);
  });

  it('POST /trips should create a new trip', async () => {
    const res = await app.request('/trips', {
      method: 'POST',
      headers: {
        'x-user-id': userId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'New Journey' }),
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.name).toBe('New Journey');
    expect(data.ownerId).toBe(userId);
  });

  it('GET /trips should return 401 if x-user-id is missing', async () => {
    const res = await app.request('/trips');
    expect(res.status).toBe(401);
  });

  it('GET /trips/:id should return trip with all its events', async () => {
    const [trip] = await db
      .insert(trips)
      .values({
        ownerId: userId,
        name: 'Single Trip Test',
      })
      .returning();

    await db.insert(itineraryEvents).values({
      tripId: trip!.id,
      type: 'ACTIVITY',
      title: 'Museum',
      startTime: new Date(),
    });

    const res = await app.request(`/trips/${trip!.id}`, {
      headers: { 'x-user-id': userId },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.name).toBe('Single Trip Test');
    expect(data.events).toHaveLength(1);
    expect(data.events[0].title).toBe('Museum');
  });

  it('POST /trips/:id/events should create a new event', async () => {
    const [trip] = await db
      .insert(trips)
      .values({
        ownerId: userId,
        name: 'Event Creation Trip',
      })
      .returning();

    const res = await app.request(`/trips/${trip!.id}/events`, {
      method: 'POST',
      headers: {
        'x-user-id': userId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'STAY',
        title: 'New Hotel',
        startTime: '2026-11-01T15:00:00Z',
      }),
    });

    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.title).toBe('New Hotel');
  });

  it('PATCH /trips/:id/events/:eventId should update an existing event', async () => {
    const [trip] = await db
      .insert(trips)
      .values({
        ownerId: userId,
        name: 'Event Update Trip',
      })
      .returning();

    const [event] = await db
      .insert(itineraryEvents)
      .values({
        tripId: trip!.id,
        type: 'ACTIVITY',
        title: 'Old Title',
        startTime: new Date(),
      })
      .returning();

    const res = await app.request(`/trips/${trip!.id}/events/${event!.id}`, {
      method: 'PATCH',
      headers: {
        'x-user-id': userId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: 'New Title' }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.title).toBe('New Title');
  });

  it('DELETE /trips/:id/events/:eventId should delete an event', async () => {
    const [trip] = await db
      .insert(trips)
      .values({
        ownerId: userId,
        name: 'Event Delete Trip',
      })
      .returning();

    const [event] = await db
      .insert(itineraryEvents)
      .values({
        tripId: trip!.id,
        type: 'ACTIVITY',
        title: 'Bye Bye',
        startTime: new Date(),
      })
      .returning();

    const res = await app.request(`/trips/${trip!.id}/events/${event!.id}`, {
      method: 'DELETE',
      headers: { 'x-user-id': userId },
    });

    expect(res.status).toBe(200);

    const [found] = await db
      .select()
      .from(itineraryEvents)
      .where(eq(itineraryEvents.id, event!.id));
    expect(found).toBeUndefined();
  });

  it('PATCH /trips/:id/shift should shift all events in a trip', async () => {
    const [trip] = await db
      .insert(trips)
      .values({
        ownerId: userId,
        name: 'Shift Test Trip',
      })
      .returning();

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

    const [updatedEvent] = await db
      .select()
      .from(itineraryEvents)
      .where(eq(itineraryEvents.id, event!.id));
    expect(new Date(updatedEvent!.startTime).toISOString()).toBe('2026-10-02T10:00:00.000Z');
  });

  it('DELETE /trips/:id should delete a trip if user is owner', async () => {
    const [trip] = await db
      .insert(trips)
      .values({
        ownerId: userId,
        name: 'Delete Me',
      })
      .returning();

    const res = await app.request(`/trips/${trip!.id}`, {
      method: 'DELETE',
      headers: { 'x-user-id': userId },
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);

    const [found] = await db.select().from(trips).where(eq(trips.id, trip!.id));
    expect(found).toBeUndefined();
  });

  it('PATCH /trips/:id should update a trip', async () => {
    const [trip] = await db
      .insert(trips)
      .values({
        ownerId: userId,
        name: 'To Update',
      })
      .returning();

    const res = await app.request(`/trips/${trip!.id}`, {
      method: 'PATCH',
      headers: {
        'x-user-id': userId,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: 'Updated Name', startDate: '2026-06-01T00:00:00.000Z' }),
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.name).toBe('Updated Name');
    expect(new Date(data.startDate).toISOString()).toBe('2026-06-01T00:00:00.000Z');
  });
});
