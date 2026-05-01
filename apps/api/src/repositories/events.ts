import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { itineraryEvents } from '../db/schema';

/**
 * Repository for managing Itinerary Events in the database.
 */
export class EventRepository {
  constructor(private db: PostgresJsDatabase<typeof schema>) {}

  /**
   * Creates a new itinerary event.
   *
   * @param event - The event data to insert.
   * @returns The created event.
   */
  async create(event: typeof itineraryEvents.$inferInsert) {
    const [result] = await this.db.insert(itineraryEvents).values(event).returning();

    if (!result) {
      throw new Error('Failed to create event');
    }

    return result;
  }

  /**
   * Finds all events associated with a specific trip.
   *
   * @param tripId - The ID of the trip.
   * @returns An array of itinerary events sorted by start time.
   */
  async findByTripId(tripId: string) {
    return this.db
      .select()
      .from(itineraryEvents)
      .where(eq(itineraryEvents.tripId, tripId))
      .orderBy(itineraryEvents.startTime);
  }

  /**
   * Updates an existing itinerary event.
   *
   * @param id - The ID of the event to update.
   * @param data - The partial data to update.
   * @returns The updated event.
   */
  async update(id: string, data: Partial<typeof itineraryEvents.$inferInsert>) {
    const [result] = await this.db
      .update(itineraryEvents)
      .set(data)
      .where(eq(itineraryEvents.id, id))
      .returning();

    if (!result) {
      throw new Error('Event not found');
    }

    return result;
  }

  /**
   * Deletes an itinerary event.
   *
   * @param id - The ID of the event to delete.
   */
  async delete(id: string) {
    const result = await this.db.delete(itineraryEvents).where(eq(itineraryEvents.id, id));

    return result;
  }
}
