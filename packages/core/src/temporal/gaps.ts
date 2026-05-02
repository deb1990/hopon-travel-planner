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
 * @param tripStart - Optional trip start date (ISO string) to detect starting gaps.
 * @param tripEnd - Optional trip end date (ISO string) to detect ending gaps.
 * @returns An array of intervals (startTime, endTime, numDays) representing the gaps.
 */
export function identifyItineraryGaps(
  events: ItineraryEvent[],
  tripStart?: string,
  tripEnd?: string,
): { startTime: string; endTime: string; numDays: number }[] {
  const stays = events
    .filter((e) => e.type === 'STAY')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const gaps: { startTime: string; endTime: string; numDays: number }[] = [];

  if (stays.length === 0) {
    // If no stays exist, check if there's a gap between tripStart and tripEnd
    if (tripStart && tripEnd) {
      const s = new Date(tripStart);
      const e = new Date(tripEnd);
      const startUtc = Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate());
      const endUtc = Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate());
      const numDays = Math.floor((endUtc - startUtc) / (1000 * 60 * 60 * 24)) + 1;
      if (numDays > 0) {
        gaps.push({ startTime: tripStart, endTime: tripEnd, numDays });
      }
    }
    return gaps;
  }

  // 1. Check for START gap (Trip Start vs First Stay)
  if (tripStart) {
    const firstStay = stays[0]!;
    const tStart = new Date(tripStart);
    const fStart = new Date(firstStay.startTime);
    const tStartUtc = Date.UTC(tStart.getUTCFullYear(), tStart.getUTCMonth(), tStart.getUTCDate());
    const fStartUtc = Date.UTC(fStart.getUTCFullYear(), fStart.getUTCMonth(), fStart.getUTCDate());

    if (fStartUtc > tStartUtc) {
      const numDays = Math.floor((fStartUtc - tStartUtc) / (1000 * 60 * 60 * 24));
      if (numDays > 0) {
        gaps.push({ startTime: tripStart, endTime: firstStay.startTime, numDays });
      }
    }
  }

  // 2. Check for MIDDLE gaps (Stay A vs Stay B)
  for (let i = 0; i < stays.length - 1; i++) {
    const currentStay = stays[i]!;
    const nextStay = stays[i + 1]!;

    if (!currentStay.endTime) continue;

    const s = new Date(currentStay.endTime);
    const e = new Date(nextStay.startTime);
    const checkoutUtc = Date.UTC(s.getUTCFullYear(), s.getUTCMonth(), s.getUTCDate());
    const checkinUtc = Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate());

    if (checkinUtc > checkoutUtc) {
      const numDays = Math.floor((checkinUtc - checkoutUtc) / (1000 * 60 * 60 * 24));
      if (numDays > 0) {
        gaps.push({ startTime: currentStay.endTime, endTime: nextStay.startTime, numDays });
      }
    }
  }

  // 3. Check for END gap (Last Stay vs Trip End)
  if (tripEnd) {
    const lastStay = stays[stays.length - 1]!;
    if (lastStay.endTime) {
      const lEnd = new Date(lastStay.endTime);
      const tEnd = new Date(tripEnd);
      const lEndUtc = Date.UTC(lEnd.getUTCFullYear(), lEnd.getUTCMonth(), lEnd.getUTCDate());
      const tEndUtc = Date.UTC(tEnd.getUTCFullYear(), tEnd.getUTCMonth(), tEnd.getUTCDate());

      if (tEndUtc > lEndUtc) {
        const numDays = Math.floor((tEndUtc - lEndUtc) / (1000 * 60 * 60 * 24));
        if (numDays > 0) {
          gaps.push({ startTime: lastStay.endTime, endTime: tripEnd, numDays });
        }
      }
    }
  }

  return gaps;
}
