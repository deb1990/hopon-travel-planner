import { describe, it, expect } from 'vitest';
import { ItineraryEvent } from '../types';
import { identifyItineraryGaps } from './gaps';

describe('Gap Detection Logic (Date-Only)', () => {
  it('should identify a 2-day gap (Oct 3, Oct 4) between Oct 3 and Oct 5', () => {
    const events: ItineraryEvent[] = [
      {
        id: 'stay-1',
        tripId: 'trip-1',
        type: 'STAY',
        title: 'Tokyo',
        startTime: '2026-10-01T15:00:00Z',
        endTime: '2026-10-03T11:00:00Z', // Check-out Oct 3
      },
      {
        id: 'stay-2',
        tripId: 'trip-1',
        type: 'STAY',
        title: 'Osaka',
        startTime: '2026-10-05T15:00:00Z', // Check-in Oct 5
        endTime: '2026-10-08T10:00:00Z',
      },
    ];

    const result = identifyItineraryGaps(events);

    expect(result).toHaveLength(1);
    expect(result[0]!.numDays).toBe(2); // Oct 3 and Oct 4
  });

  it('should identify a 1-day gap (Oct 3) if next stay starts Oct 4', () => {
    const events: ItineraryEvent[] = [
      {
        id: 'stay-1',
        tripId: 'trip-1',
        type: 'STAY',
        title: 'Tokyo',
        startTime: '2026-10-01T15:00:00Z',
        endTime: '2026-10-03T11:00:00Z',
      },
      {
        id: 'stay-2',
        tripId: 'trip-1',
        type: 'STAY',
        title: 'Osaka',
        startTime: '2026-10-04T15:00:00Z',
        endTime: '2026-10-08T10:00:00Z',
      },
    ];

    const result = identifyItineraryGaps(events);
    expect(result[0]!.numDays).toBe(1); // Oct 3
  });

  it('should identify NO gap if next stay starts on the same day as previous check-out', () => {
    const events: ItineraryEvent[] = [
      {
        id: 'stay-1',
        tripId: 'trip-1',
        type: 'STAY',
        title: 'Tokyo',
        startTime: '2026-10-01T15:00:00Z',
        endTime: '2026-10-03T11:00:00Z',
      },
      {
        id: 'stay-2',
        tripId: 'trip-1',
        type: 'STAY',
        title: 'Osaka',
        startTime: '2026-10-03T15:00:00Z', // Same day!
        endTime: '2026-10-08T10:00:00Z',
      },
    ];

    const result = identifyItineraryGaps(events);
    expect(result).toHaveLength(0);
  });

  it('should ignore time differences and only focus on calendar dates', () => {
    const events: ItineraryEvent[] = [
      {
        id: 'stay-1',
        tripId: 'trip-1',
        type: 'STAY',
        title: 'Late Checkout',
        startTime: '2026-10-01T15:00:00Z',
        endTime: '2026-10-03T23:59:00Z',
      },
      {
        id: 'stay-2',
        tripId: 'trip-1',
        type: 'STAY',
        title: 'Early Checkin',
        startTime: '2026-10-04T00:01:00Z',
        endTime: '2026-10-08T10:00:00Z',
      },
    ];
    // Mathematically this is only 2 minutes gap, but calendar-wise
    // it's 1 day (Oct 3 night) without a base assignment.
    const result = identifyItineraryGaps(events);
    expect(result[0]!.numDays).toBe(1);
  });
});
