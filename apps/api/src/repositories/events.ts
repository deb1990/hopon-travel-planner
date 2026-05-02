import { eq, and, or, exists } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { itineraryEvents, trips, permissions } from '../db/schema';

/**
 * Repository for managing Itinerary Events with strict ownership enforcement.
 */
export class EventRepository {
  constructor(private db: PostgresJsDatabase<typeof schema>) {}

  /**
   * Creates a new itinerary event.
   */
  async create(event: typeof itineraryEvents.$inferInsert) {
    const [result] = await this.db.insert(itineraryEvents).values(event).returning();
    if (!result) throw new Error('Failed to create event');
    return result;
  }

  /**
   * Finds events for a trip, but ONLY if the user has permission.
   */
  async findByTripId(tripId: string, userId: string) {
    return this.db
      .select({ event: itineraryEvents })
      .from(itineraryEvents)
      .innerJoin(trips, eq(itineraryEvents.tripId, trips.id))
      .where(
        and(
          eq(itineraryEvents.tripId, tripId),
          or(
            eq(trips.ownerId, userId),
            eq(trips.visibility, 'public'),
            exists(
              this.db
                .select()
                .from(permissions)
                .where(and(eq(permissions.tripId, tripId), eq(permissions.userId, userId))),
            ),
          ),
        ),
      )
      .orderBy(itineraryEvents.startTime)
      .then((rows) => rows.map((r) => r.event));
  }

  /**
   * Updates an event ONLY if the user is the owner or an editor.
   */
  async update(id: string, userId: string, data: Partial<typeof itineraryEvents.$inferInsert>) {
    const [result] = await this.db
      .update(itineraryEvents)
      .set(data)
      .where(
        and(
          eq(itineraryEvents.id, id),
          or(
            exists(
              this.db
                .select()
                .from(trips)
                .where(and(eq(trips.id, itineraryEvents.tripId), eq(trips.ownerId, userId))),
            ),
            exists(
              this.db
                .select()
                .from(permissions)
                .where(
                  and(
                    eq(permissions.tripId, itineraryEvents.tripId),
                    eq(permissions.userId, userId),
                    eq(permissions.role, 'editor'),
                  ),
                ),
            ),
          ),
        ),
      )
      .returning();

    if (!result) throw new Error('Event not found or unauthorized');
    return result;
  }

  /**
   * Deletes an event ONLY if the user is the owner or an editor.
   */
  async delete(id: string, userId: string) {
    const [result] = await this.db
      .delete(itineraryEvents)
      .where(
        and(
          eq(itineraryEvents.id, id),
          or(
            exists(
              this.db
                .select()
                .from(trips)
                .where(and(eq(trips.id, itineraryEvents.tripId), eq(trips.ownerId, userId))),
            ),
            exists(
              this.db
                .select()
                .from(permissions)
                .where(
                  and(
                    eq(permissions.tripId, itineraryEvents.tripId),
                    eq(permissions.userId, userId),
                    eq(permissions.role, 'editor'),
                  ),
                ),
            ),
          ),
        ),
      )
      .returning();

    if (!result) throw new Error('Event not found or unauthorized');
    return result;
  }
}
