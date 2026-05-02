import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../db';
import { users, trips, itineraryEvents, permissions } from '../db/schema';
import { EventRepository } from './events';
import { eq, inArray } from 'drizzle-orm';

describe('EventRepository Security Audit', () => {
  let ownerId: string;
  let editorId: string;
  let viewerId: string;
  let strangerId: string;
  let privateTripId: string;
  let publicTripId: string;

  beforeAll(async () => {
    // 1. Create Users
    const [u1] = await db
      .insert(users)
      .values({ email: `owner_${Date.now()}@test.com`, provider: 'google' })
      .returning();
    const [u2] = await db
      .insert(users)
      .values({ email: `editor_${Date.now()}@test.com`, provider: 'google' })
      .returning();
    const [u3] = await db
      .insert(users)
      .values({ email: `viewer_${Date.now()}@test.com`, provider: 'google' })
      .returning();
    const [u4] = await db
      .insert(users)
      .values({ email: `stranger_${Date.now()}@test.com`, provider: 'google' })
      .returning();

    ownerId = u1!.id;
    editorId = u2!.id;
    viewerId = u3!.id;
    strangerId = u4!.id;

    // 2. Create Trips
    const [t1] = await db
      .insert(trips)
      .values({ ownerId: ownerId, name: 'Private', visibility: 'private' })
      .returning();
    const [t2] = await db
      .insert(trips)
      .values({ ownerId: ownerId, name: 'Public', visibility: 'public' })
      .returning();

    privateTripId = t1!.id;
    publicTripId = t2!.id;

    // 3. Set Permissions for Private Trip
    await db.insert(permissions).values([
      { tripId: privateTripId, userId: editorId, role: 'editor' },
      { tripId: privateTripId, userId: viewerId, role: 'viewer' },
    ]);
  });

  afterAll(async () => {
    await db
      .delete(itineraryEvents)
      .where(inArray(itineraryEvents.tripId, [privateTripId, publicTripId]));
    await db.delete(permissions).where(eq(permissions.tripId, privateTripId));
    await db.delete(trips).where(eq(trips.ownerId, ownerId));
    await db.delete(users).where(inArray(users.id, [ownerId, editorId, viewerId, strangerId]));
  });

  it('EDITOR should be able to update and delete events', async () => {
    const repo = new EventRepository(db);
    const event = await repo.create({
      tripId: privateTripId,
      type: 'ACTIVITY',
      title: 'Edit Me',
      startTime: new Date(),
    });

    // Update
    const updated = await repo.update(event.id, editorId, { title: 'Edited by Editor' });
    expect(updated.title).toBe('Edited by Editor');

    // Delete
    const deleted = await repo.delete(event.id, editorId);
    expect(deleted.id).toBe(event.id);
  });

  it('VIEWER should be able to view but NOT update or delete', async () => {
    const repo = new EventRepository(db);
    const event = await repo.create({
      tripId: privateTripId,
      type: 'ACTIVITY',
      title: 'View Only',
      startTime: new Date(),
    });

    // View
    const list = await repo.findByTripId(privateTripId, viewerId);
    expect(list.some((e) => e.id === event.id)).toBe(true);

    // Update
    await expect(repo.update(event.id, viewerId, { title: 'Hacked' })).rejects.toThrow(
      /unauthorized/i,
    );

    // Delete
    await expect(repo.delete(event.id, viewerId)).rejects.toThrow(/unauthorized/i);

    // Manual Cleanup
    await db.delete(itineraryEvents).where(eq(itineraryEvents.id, event.id));
  });

  it('STRANGER should be able to view PUBLIC trip events without permission entry', async () => {
    const repo = new EventRepository(db);
    const event = await repo.create({
      tripId: publicTripId,
      type: 'ACTIVITY',
      title: 'Public Show',
      startTime: new Date(),
    });

    const list = await repo.findByTripId(publicTripId, strangerId);
    expect(list.some((e) => e.id === event.id)).toBe(true);
  });

  it('STRANGER should NOT be able to view PRIVATE trip events', async () => {
    const repo = new EventRepository(db);
    const list = await repo.findByTripId(privateTripId, strangerId);
    expect(list).toHaveLength(0);
  });
});
