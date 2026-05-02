import { ItineraryEvent } from '../types';

/**
 * Analyzes the timeline to identify gaps between stays.
 * A gap is defined as any period between the end of one 'STAY'
 * and the start of the next 'STAY' where no accommodation is assigned.
 *
 * This function focuses strictly on calendar dates, ignoring specific times.
 * Gap Days = (Next Stay Start Date) - (Current Stay End Date).
 *
 * @param events - The list of all itinerary events.
 * @returns An array of intervals (startTime, endTime, numDays) representing the gaps.
 */
export function identifyItineraryGaps(
  events: ItineraryEvent[],
): { startTime: string; endTime: string; numDays: number }[] {
  const stays = events
    .filter((e) => e.type === 'STAY')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const gaps: { startTime: string; endTime: string; numDays: number }[] = [];

  for (let i = 0; i < stays.length - 1; i++) {
    const currentStay = stays[i];
    const nextStay = stays[i + 1];

    if (!currentStay || !nextStay || !currentStay.endTime) continue;

    // Normalize both to UTC Date objects at midnight (ignore time)
    const s = new Date(currentStay.endTime);
    const e = new Date(nextStay.startTime);

    const checkoutUtc = Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate());
    const checkinUtc = Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate());

    if (checkinUtc > checkoutUtc) {
      const diffMs = checkinUtc - checkoutUtc;
      const numDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (numDays > 0) {
        gaps.push({
          startTime: currentStay.endTime,
          endTime: nextStay.startTime,
          numDays,
        });
      }
    }
  }

  return gaps;
}
