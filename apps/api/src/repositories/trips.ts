import { eq, and, or, exists } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { trips, permissions, itineraryEvents } from '../db/schema';

/**
 * Repository for managing Trips and Permissions.
 */
export class TripRepository {
  constructor(private db: PostgresJsDatabase<typeof schema>) {}

  /**
   * Creates a new trip.
   */
  async create(trip: typeof trips.$inferInsert) {
    const [result] = await this.db.insert(trips).values(trip).returning();
    if (!result) throw new Error('Failed to create trip');
    return result;
  }

  /**
   * Adds a permission/collaborator to a trip.
   */
  async addPermission(tripId: string, userId: string, role: 'editor' | 'viewer') {
    return this.db
      .insert(permissions)
      .values({
        tripId,
        userId,
        role,
      })
      .returning();
  }

  /**
   * Finds all trips a user has access to (owned, shared, or public).
   */
  async findAccessibleByUserId(userId: string) {
    return this.db
      .select()
      .from(trips)
      .where(
        or(
          eq(trips.ownerId, userId),
          eq(trips.visibility, 'public'),
          exists(
            this.db
              .select()
              .from(permissions)
              .where(and(eq(permissions.tripId, trips.id), eq(permissions.userId, userId))),
          ),
        ),
      );
  }

  /**
   * Finds all public trips.
   */
  async findPublic() {
    return this.db.select().from(trips).where(eq(trips.visibility, 'public'));
  }

  /**
   * Gets the specific role of a user for a trip.
   * Returns 'owner', 'editor', 'viewer', or null.
   */
  async getUserRole(tripId: string, userId: string): Promise<'owner' | 'editor' | 'viewer' | null> {
    const [trip] = await this.db.select().from(trips).where(eq(trips.id, tripId));
    if (!trip) return null;
    if (trip.ownerId === userId) return 'owner';

    const [permission] = await this.db
      .select()
      .from(permissions)
      .where(and(eq(permissions.tripId, tripId), eq(permissions.userId, userId)));

    return permission?.role || null;
  }

  /**
   * Deletes a trip and all its associated data (events, permissions).
   * ONLY the owner can delete a trip.
   */
  async delete(tripId: string, userId: string) {
    return this.db.transaction(async (tx) => {
      // 1. Verify ownership
      const [trip] = await tx
        .select()
        .from(trips)
        .where(and(eq(trips.id, tripId), eq(trips.ownerId, userId)));
      if (!trip) throw new Error('Unauthorized or Trip not found');

      // 2. Cascade delete
      await tx.delete(itineraryEvents).where(eq(itineraryEvents.tripId, tripId));
      await tx.delete(permissions).where(eq(permissions.tripId, tripId));
      await tx.delete(trips).where(eq(trips.id, tripId));

      return { success: true };
    });
  }
}
