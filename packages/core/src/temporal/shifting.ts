import { ItineraryEvent } from '../types';

/**
 * Shifts the timing of a provided list of events by a specific millisecond offset.
 * Useful for moving entire "Base Groups" or clusters of activities in the timeline.
 *
 * @param events - The array of events to shift.
 * @param offsetMs - The positive or negative millisecond offset to apply.
 * @returns A new array of events with updated startTime and endTime.
 */
export function shiftEvents(events: ItineraryEvent[], offsetMs: number): ItineraryEvent[] {
  // 1. Return original array if no shift is requested to avoid unnecessary mutation
  if (offsetMs === 0) return events;

  return events.map((event) => {
    // 2. Respect the isLocked flag - do not modify locked events
    if (event.isLocked) return event;

    const newStartTime = new Date(new Date(event.startTime).getTime() + offsetMs).toISOString();

    let newEndTime: string | undefined = undefined;
    if (event.endTime) {
      newEndTime = new Date(new Date(event.endTime).getTime() + offsetMs).toISOString();
    }

    return {
      ...event,
      startTime: newStartTime,
      endTime: newEndTime,
    };
  });
}
