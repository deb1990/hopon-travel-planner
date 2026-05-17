import { ItineraryEvent, DayGroup, StayEvent } from '../types';

/**
 * Groups flat itinerary events into Day Groups.
 * Every calendar day between tripStart and tripEnd is accounted for.
 *
 * @param events - The flat list of itinerary events.
 * @param tripStart - ISO start date of the trip.
 * @param tripEnd - ISO end date of the trip.
 * @returns An array of DayGroups.
 */
export function groupEventsByDay(
  events: ItineraryEvent[],
  tripStart?: string | null,
  tripEnd?: string | null,
): DayGroup[] {
  if (!tripStart || !tripEnd) return [];

  const start = new Date(tripStart);
  const end = new Date(tripEnd);

  // Normalize to UTC midnight for consistent iteration
  const current = new Date(
    Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()),
  );
  const terminal = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate()));

  const days: DayGroup[] = [];

  while (current <= terminal) {
    const dateISO = current.toISOString();
    const dayStart = current.getTime();
    const dayEnd = dayStart + 24 * 60 * 60 * 1000 - 1;

    // 1. Find all events that start on this calendar day
    const dayItems = events
      .filter((e) => {
        if (e.type === 'STAY') return false; // Stays are metadata/tags for the day
        const eventTime = new Date(e.startTime).getTime();
        return eventTime >= dayStart && eventTime <= dayEnd;
      })
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

    // 2. Find all stays that are "active" during this day
    // A stay is active if the day falls between [stayStart, stayEnd]
    const activeStays = events.filter((e) => {
      if (e.type !== 'STAY') return false;
      const sStart = new Date(e.startTime);
      const sEnd = e.endTime ? new Date(e.endTime) : sStart;

      // Normalize stay boundaries to dates for "Day-Ownership"
      const sStartDate = Date.UTC(
        sStart.getUTCFullYear(),
        sStart.getUTCMonth(),
        sStart.getUTCDate(),
      );
      const sEndDate = Date.UTC(sEnd.getUTCFullYear(), sEnd.getUTCMonth(), sEnd.getUTCDate());

      return dayStart >= sStartDate && dayStart <= sEndDate;
    }) as StayEvent[];

    days.push({
      date: dateISO,
      items: dayItems,
      activeStays,
    });

    current.setUTCDate(current.getUTCDate() + 1);
  }

  return days;
}

/**
 * @deprecated Legacy grouping logic. Use groupEventsByDay.
 */
export function groupEventsByBase(): any[] {
  return [];
}
