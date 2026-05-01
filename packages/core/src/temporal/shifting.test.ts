import { describe, it, expect } from 'vitest';

import { ItineraryEvent } from '../types';

import { shiftEvents } from './shifting';

describe('Time-Slice Shifting Logic', () => {
  it('should shift all event times by the given millisecond offset', () => {
    const events: ItineraryEvent[] = [
      {
        id: 'stay-1',
        tripId: 'trip-1',
        type: 'STAY',
        title: 'Tokyo Hotel',
        startTime: '2026-10-01T10:00:00Z',
        endTime: '2026-10-05T10:00:00Z',
      },
      {
        id: 'act-1',
        tripId: 'trip-1',
        type: 'ACTIVITY',
        title: 'Sushi',
        startTime: '2026-10-02T10:00:00Z',
      },
    ];

    // Shift by exactly 1 day (86,400,000 ms)
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const result = shiftEvents(events, ONE_DAY_MS);

    expect(result[0]!.startTime).toBe('2026-10-02T10:00:00.000Z');
    expect(result[0]!.endTime).toBe('2026-10-06T10:00:00.000Z');
    expect(result[1]!.startTime).toBe('2026-10-03T10:00:00.000Z');
  });
});
