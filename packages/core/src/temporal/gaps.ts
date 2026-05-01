import { ItineraryEvent } from '../types';

/**
 * Analyzes the timeline to identify gaps between stays.
 * A gap is defined as any period between the end of one 'STAY' 
 * and the start of the next 'STAY' where no accommodation is assigned.
 * 
 * @param events - The list of all itinerary events.
 * @returns An array of intervals (startTime, endTime) representing the identified gaps.
 */
export function identifyItineraryGaps(events: ItineraryEvent[]): { startTime: string, endTime: string }[] {
  const stays = events
    .filter(e => e.type === 'STAY')
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const gaps: { startTime: string, endTime: string }[] = [];

  for (let i = 0; i < stays.length - 1; i++) {
    const currentStay = stays[i];
    const nextStay = stays[i + 1];

    if (!currentStay.endTime) continue;

    const currentEnd = new Date(currentStay.endTime).getTime();
    const nextStart = new Date(nextStay.startTime).getTime();

    if (nextStart > currentEnd) {
      gaps.push({
        startTime: currentStay.endTime,
        endTime: nextStay.startTime,
      });
    }
  }

  return gaps;
}
