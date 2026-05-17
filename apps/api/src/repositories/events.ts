import { eq, and, or, exists, lt, gt, ne } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../db/schema';
import { itineraryEvents, trips, permissions } from '../db/schema';
import { getRouteEstimate } from '@hopon/core';

/**
 * Repository for managing Itinerary Events with spatial and temporal logic.
 */
export class EventRepository {
  constructor(private db: PostgresJsDatabase<typeof schema>) {}

  private async checkStayOverlap(tripId: string, start: Date, end: Date, excludeId?: string) {
    const existingStays = await this.db
      .select()
      .from(itineraryEvents)
      .where(
        and(
          eq(itineraryEvents.tripId, tripId),
          eq(itineraryEvents.type, 'STAY'),
          excludeId ? ne(itineraryEvents.id, excludeId) : undefined,
          lt(itineraryEvents.startTime, end),
          gt(itineraryEvents.endTime, start),
        ),
      );

    return existingStays.length > 0;
  }

  /**
   * Creates a new event and calculates routing + sub-events.
   */
  async create(event: typeof itineraryEvents.$inferInsert) {
    if (event.type === 'STAY' && event.startTime && event.endTime) {
      const hasOverlap = await this.checkStayOverlap(
        event.tripId,
        new Date(event.startTime),
        new Date(event.endTime),
      );
      if (hasOverlap) {
        throw new Error('Overlapping accommodation detected for these dates.');
      }
    }

    const enrichedEvent = { ...event };

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

    // AUTOMATIC LINKED CHECK-IN/OUT
    if (result.type === 'STAY' && result.startTime && result.endTime) {
      await this.db.insert(itineraryEvents).values([
        {
          tripId: result.tripId,
          parentStayId: result.id,
          type: 'CHECK_IN',
          title: `Check-in: ${result.title}`,
          startTime: result.startTime,
          locationName: result.locationName,
          lat: result.lat,
          lng: result.lng,
          plusCode: result.plusCode,
          isLocked: true,
        },
        {
          tripId: result.tripId,
          parentStayId: result.id,
          type: 'CHECK_OUT',
          title: `Check-out: ${result.title}`,
          startTime: result.endTime,
          locationName: result.locationName,
          lat: result.lat,
          lng: result.lng,
          plusCode: result.plusCode,
          isLocked: true,
        },
      ]);
    }

    return result;
  }

  /**
   * Updates an event and recalculates routing.
   */
  async update(id: string, userId: string, data: Partial<typeof itineraryEvents.$inferInsert>) {
    const [current] = await this.db
      .select()
      .from(itineraryEvents)
      .where(eq(itineraryEvents.id, id));
    if (!current) throw new Error('Event not found');

    if ((data.type === 'STAY' || current.type === 'STAY') && (data.startTime || data.endTime)) {
      const tripId = data.tripId || current.tripId;
      const newStart = data.startTime ? new Date(data.startTime) : current.startTime;
      const newEnd = data.endTime ? new Date(data.endTime) : current.endTime;

      if (newEnd) {
        const hasOverlap = await this.checkStayOverlap(tripId, newStart, newEnd, id);
        if (hasOverlap) {
          throw new Error('Update failed: New dates overlap with another stay.');
        }
      }
    }

    const enrichedData = { ...data };

    if (data.lat || data.lng || data.startTime) {
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

    // SYNC LINKED SUB-EVENTS
    if (result.type === 'STAY') {
      // Sync Check-in
      await this.db
        .update(itineraryEvents)
        .set({
          startTime: result.startTime,
          title: `Check-in: ${result.title}`,
          locationName: result.locationName,
          lat: result.lat,
          lng: result.lng,
          plusCode: result.plusCode,
        })
        .where(
          and(eq(itineraryEvents.parentStayId, result.id), eq(itineraryEvents.type, 'CHECK_IN')),
        );

      // Sync Check-out
      if (result.endTime) {
        await this.db
          .update(itineraryEvents)
          .set({
            startTime: result.endTime,
            title: `Check-out: ${result.title}`,
            locationName: result.locationName,
            lat: result.lat,
            lng: result.lng,
            plusCode: result.plusCode,
          })
          .where(
            and(eq(itineraryEvents.parentStayId, result.id), eq(itineraryEvents.type, 'CHECK_OUT')),
          );
      }
    }

    return result;
  }

  private async getPreviousEvent(tripId: string, startTime: Date) {
    const rows = await this.db
      .select()
      .from(itineraryEvents)
      .where(eq(itineraryEvents.tripId, tripId))
      .orderBy(itineraryEvents.startTime);

    const filtered = rows
      .filter((r) => new Date(r.startTime).getTime() < startTime.getTime())
      .reverse();
    return filtered[0] || null;
  }

  /**
   * Finds events for a trip.
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
   * Deletes an event.
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
    // Cascading delete is handled by database foreign key parent_stay_id
    return result;
  }
}
