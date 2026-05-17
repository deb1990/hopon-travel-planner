import { eq, and, or, exists, lt, gt, ne, asc } from 'drizzle-orm';
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
   * Internal helper to recalculate the route for a specific event based on its chronological predecessor.
   */
  private async refreshRouteForEvent(tripId: string, eventId: string) {
    const [event] = await this.db
      .select()
      .from(itineraryEvents)
      .where(eq(itineraryEvents.id, eventId));
    if (!event || !event.lat || !event.lng) return;

    // Fixed signature: no startTime needed
    const prev = await this.getPreviousEvent(tripId, eventId);

    let polyline: string | null = null;
    let duration: number | null = null;

    if (prev && prev.lat && prev.lng) {
      const isSamePoint =
        Math.abs(prev.lat - event.lat) < 0.0001 && Math.abs(prev.lng - event.lng) < 0.0001;

      if (!isSamePoint) {
        const route = await getRouteEstimate([prev.lat, prev.lng], [event.lat, event.lng]);
        if (route) {
          polyline = route.geometry;
          duration = route.durationMinutes;
        }
      } else {
        duration = 0;
      }
    }

    await this.db
      .update(itineraryEvents)
      .set({ routePolyline: polyline, travelTimeMinutes: duration })
      .where(eq(itineraryEvents.id, eventId));
  }

  private async triggerRoutingCascade(tripId: string, eventId: string) {
    await this.refreshRouteForEvent(tripId, eventId);
    const successor = await this.getNextEvent(tripId, eventId);
    if (successor) {
      await this.refreshRouteForEvent(tripId, successor.id);
    }
  }

  /**
   * Creates a new event.
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

    const [result] = await this.db.insert(itineraryEvents).values(event).returning();
    if (!result) throw new Error('Failed to create event');

    await this.triggerRoutingCascade(result.tripId, result.id);

    if (result.type === 'STAY' && result.startTime && result.endTime) {
      const [checkin] = await this.db
        .insert(itineraryEvents)
        .values({
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
        })
        .returning();

      const [checkout] = await this.db
        .insert(itineraryEvents)
        .values({
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
        })
        .returning();

      if (checkin) await this.triggerRoutingCascade(result.tripId, checkin.id);
      if (checkout) await this.triggerRoutingCascade(result.tripId, checkout.id);
    }

    return result;
  }

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

    await this.triggerRoutingCascade(result.tripId, result.id);

    if (result.type === 'STAY') {
      const checkinStartTime = result.startTime;
      const checkoutStartTime = result.endTime;

      const [updatedCheckin] = await this.db
        .update(itineraryEvents)
        .set({
          startTime: checkinStartTime,
          title: `Check-in: ${result.title}`,
          locationName: result.locationName,
          lat: result.lat,
          lng: result.lng,
          plusCode: result.plusCode,
        })
        .where(
          and(eq(itineraryEvents.parentStayId, result.id), eq(itineraryEvents.type, 'CHECK_IN')),
        )
        .returning();

      let updatedCheckout: any = null;
      if (checkoutStartTime) {
        [updatedCheckout] = await this.db
          .update(itineraryEvents)
          .set({
            startTime: checkoutStartTime,
            title: `Check-out: ${result.title}`,
            locationName: result.locationName,
            lat: result.lat,
            lng: result.lng,
            plusCode: result.plusCode,
          })
          .where(
            and(eq(itineraryEvents.parentStayId, result.id), eq(itineraryEvents.type, 'CHECK_OUT')),
          )
          .returning();
      }

      if (updatedCheckin) await this.triggerRoutingCascade(result.tripId, updatedCheckin.id);
      if (updatedCheckout) await this.triggerRoutingCascade(result.tripId, updatedCheckout.id);
    }

    return result;
  }

  private async getPreviousEvent(tripId: string, currentId: string) {
    const rows = await this.db
      .select()
      .from(itineraryEvents)
      .where(eq(itineraryEvents.tripId, tripId))
      .orderBy(asc(itineraryEvents.startTime), asc(itineraryEvents.createdAt));

    const idx = rows.findIndex((r) => r.id === currentId);
    return idx > 0 ? rows[idx - 1] : null;
  }

  private async getNextEvent(tripId: string, currentId: string) {
    const rows = await this.db
      .select()
      .from(itineraryEvents)
      .where(eq(itineraryEvents.tripId, tripId))
      .orderBy(asc(itineraryEvents.startTime), asc(itineraryEvents.createdAt));

    const idx = rows.findIndex((r) => r.id === currentId);
    return idx !== -1 && idx < rows.length - 1 ? rows[idx + 1] : null;
  }

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
      .orderBy(asc(itineraryEvents.startTime), asc(itineraryEvents.createdAt))
      .then((rows) => rows.map((r) => r.event));
  }

  async delete(id: string, userId: string) {
    const [current] = await this.db
      .select()
      .from(itineraryEvents)
      .where(eq(itineraryEvents.id, id));
    if (!current) throw new Error('Event not found');

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

    const successor = await this.getNextEvent(result.tripId, result.id);
    if (successor) {
      await this.refreshRouteForEvent(result.tripId, successor.id);
    }

    return result;
  }
}
