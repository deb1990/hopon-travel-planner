import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from '../db';
import { users, trips, permissions } from '../db/schema';
import { TripRepository } from './trips';
import { eq } from 'drizzle-orm';

describe('TripRepository', () => {
  let userIdA: string;
  let userIdB: string;

  beforeAll(async () => {
    // Setup users
    const [uA] = await db
      .insert(users)
      .values({ email: `a_${Date.now()}@test.com`, provider: 'google' })
      .returning();
    const [uB] = await db
      .insert(users)
      .values({ email: `b_${Date.now()}@test.com`, provider: 'google' })
      .returning();
    userIdA = uA!.id;
    userIdB = uB!.id;
  });

  afterAll(async () => {
    await db.delete(permissions).where(eq(permissions.userId, userIdA));
    await db.delete(permissions).where(eq(permissions.userId, userIdB));
    await db.delete(trips).where(eq(trips.ownerId, userIdA));
    await db.delete(users).where(eq(users.id, userIdA));
    await db.delete(users).where(eq(users.id, userIdB));
  });

  it('should create a trip and allow sharing with another user', async () => {
    const repo = new TripRepository(db);

    // 1. Create trip
    const trip = await repo.create({
      ownerId: userIdA,
      name: 'Shared Vacation',
    });
    expect(trip.id).toBeDefined();

    // 2. Share with User B as editor
    await repo.addPermission(trip.id, userIdB, 'editor');

    // 3. Verify User B has access
    const userBTrips = await repo.findAccessibleByUserId(userIdB);
    expect(userBTrips.find((t) => t.id === trip.id)).toBeDefined();

    // 4. Verify Role
    const role = await repo.getUserRole(trip.id, userIdB);
    expect(role).toBe('editor');
  });

  it('should list public trips for everyone', async () => {
    const repo = new TripRepository(db);
    const trip = await repo.create({
      ownerId: userIdA,
      name: 'Public Guide',
      visibility: 'public',
    });

    const publicTrips = await repo.findPublic();
    expect(publicTrips.find((t) => t.id === trip.id)).toBeDefined();
  });
});
