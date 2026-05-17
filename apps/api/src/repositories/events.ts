import { eq, and, or, exists } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { itineraryEvents, trips, permissions } from '../db/schema';
import { getRouteEstimate } from '@hopon/core';

/**
 * Repository for managing Itinerary Events with spatial and temporal logic.
 */
export class EventRepository {
  constructor(private db: PostgresJsDatabase<typeof schema>) {}

  /**
   * Creates a new event and calculates routing from the previous item if possible.
   */
  async create(event: typeof itineraryEvents.$inferInsert) {
    const enrichedEvent = { ...event };

    // Automatic Routing Logic
    if (event.lat && event.lng) {
      const prevEvent = await this.getPreviousEvent(event.tripId, new Date(event.startTime));
      if (prevEvent && prevEvent.lat && prevEvent.lng) {
        const route = await getRouteEstimate(
          [prevEvent.lat, prevEvent.lng],
          [event.lat, event.lng],
        );
        if (route) {
          enrichedEvent.routePolyline = route.geometry;
          enrichedEvent.travelTimeMinutes = route.durationMinutes;
        }
      }
    }

    const [result] = await this.db.insert(itineraryEvents).values(enrichedEvent).returning();
    if (!result) throw new Error('Failed to create event');
    return result;
  }

  /**
   * Updates an event and recalculates routing.
   */
  async update(id: string, userId: string, data: Partial<typeof itineraryEvents.$inferInsert>) {
    const enrichedData = { ...data };

    // If coordinates or time changed, we might need new routing
    if (data.lat || data.lng || data.startTime) {
      // Fetch current full event to get context
      const [current] = await this.db
        .select()
        .from(itineraryEvents)
        .where(eq(itineraryEvents.id, id));
      if (current) {
        const tripId = data.tripId || current.tripId;
        const startTime = data.startTime || current.startTime;
        const lat = data.lat || current.lat;
        const lng = data.lng || current.lng;

        if (lat && lng) {
          const prev = await this.getPreviousEvent(tripId, new Date(startTime));
          if (prev && prev.lat && prev.lng) {
            const route = await getRouteEstimate([prev.lat, prev.lng], [lat, lng]);
            if (route) {
              enrichedData.routePolyline = route.geometry;
              enrichedData.travelTimeMinutes = route.durationMinutes;
            }
          }
        }
      }
    }

    const [result] = await this.db
      .update(itineraryEvents)
      .set(enrichedData)
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

  private async getPreviousEvent(tripId: string, startTime: Date) {
    const [prev] = await this.db
      .select()
      .from(itineraryEvents)
      .where(
        and(
          eq(itineraryEvents.tripId, tripId),
          // Find the latest event that starts before the current one
        ),
      )
      .orderBy(itineraryEvents.startTime)
      // This is a simplified sequential check. In a real app we'd use a cleaner offset.
      .then((rows) =>
        rows.filter((r) => new Date(r.startTime).getTime() < startTime.getTime()).reverse(),
      );

    return prev || null;
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
