import { describe, it, expect } from 'vitest';

import { ItineraryEvent } from '../types';

import { identifyItineraryGaps } from './gaps';

describe('Gap Detection Logic', () => {
  it('should identify a gap between two stays', () => {
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
        startTime: '2026-10-05T15:00:00Z',
        endTime: '2026-10-08T10:00:00Z',
      },
    ];

    const result = identifyItineraryGaps(events);

    expect(result).toHaveLength(1);
    expect(result[0]!.startTime).toBe('2026-10-03T11:00:00Z');
    expect(result[0]!.endTime).toBe('2026-10-05T15:00:00Z');
  });

  it('should return empty if there are no gaps', () => {
    const events: ItineraryEvent[] = [
      {
        id: 'stay-1',
        tripId: 'trip-1',
        type: 'STAY',
        title: 'Tokyo',
        startTime: '2026-10-01T15:00:00Z',
        endTime: '2026-10-05T11:00:00Z',
      },
      {
        id: 'stay-2',
        tripId: 'trip-1',
        type: 'STAY',
        title: 'Osaka',
        startTime: '2026-10-05T11:00:00Z',
        endTime: '2026-10-08T10:00:00Z',
      },
    ];
    const result = identifyItineraryGaps(events);
    expect(result).toHaveLength(0);
  });
});
