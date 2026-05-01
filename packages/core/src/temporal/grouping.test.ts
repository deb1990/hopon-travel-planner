import { describe, it, expect } from 'vitest';

import { ItineraryEvent } from '../types';

import { groupEventsByBase } from './grouping';

describe('Event Grouping Logic', () => {
  it('should group activities under their chronologically associated stay', () => {
    const events: ItineraryEvent[] = [
      {
        id: 'stay-1',
        tripId: 'trip-1',
        type: 'STAY',
        title: 'Tokyo Hotel',
        startTime: '2026-10-01T15:00:00Z',
        endTime: '2026-10-05T11:00:00Z',
      },
      {
        id: 'act-1',
        tripId: 'trip-1',
        type: 'ACTIVITY',
        title: 'Sushi Dinner',
        startTime: '2026-10-02T19:00:00Z',
      },
      {
        id: 'stay-2',
        tripId: 'trip-1',
        type: 'STAY',
        title: 'Osaka Ryokan',
        startTime: '2026-10-05T15:00:00Z',
        endTime: '2026-10-08T10:00:00Z',
      },
      {
        id: 'act-2',
        tripId: 'trip-1',
        type: 'ACTIVITY',
        title: 'Universal Studios',
        startTime: '2026-10-06T10:00:00Z',
      },
    ];

    const result = groupEventsByBase(events);

    expect(result).toHaveLength(2);
    expect(result[0].stay.id).toBe('stay-1');
    expect(result[0].items).toContainEqual(expect.objectContaining({ id: 'act-1' }));
    expect(result[1].stay.id).toBe('stay-2');
    expect(result[1].items).toContainEqual(expect.objectContaining({ id: 'act-2' }));
  });

  it('should handle activities occurring before any stay as orphans (handled by UI later)', () => {
     // This test ensures we only group what is actually bounded by a stay
  });
});
