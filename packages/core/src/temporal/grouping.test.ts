import { describe, it, expect } from 'vitest';
import { ItineraryEvent } from '../types';
import { groupEventsByBase } from './grouping';

describe('Event Grouping Logic', () => {
  it('should group activities under their chronologically active stay', () => {
    const events: ItineraryEvent[] = [
      {
        id: 'stay-1',
        tripId: 't1',
        type: 'STAY',
        title: 'Tokyo Hotel',
        startTime: '2026-10-01T15:00:00Z',
        endTime: '2026-10-05T11:00:00Z',
        isLocked: false,
      },
      {
        id: 'act-1',
        tripId: 't1',
        type: 'ACTIVITY',
        title: 'Sushi Lunch',
        startTime: '2026-10-02T12:00:00Z',
        isLocked: false,
      },
      {
        id: 'stay-2',
        tripId: 't1',
        type: 'STAY',
        title: 'Osaka Hotel',
        startTime: '2026-10-05T15:00:00Z',
        endTime: '2026-10-08T10:00:00Z',
        isLocked: false,
      },
      {
        id: 'act-2',
        tripId: 't1',
        type: 'ACTIVITY',
        title: 'Castle Tour',
        startTime: '2026-10-06T10:00:00Z',
        isLocked: false,
      },
    ];

    const result = groupEventsByBase(events);

    expect(result).toHaveLength(2);
    expect(result[0]!.stay.title).toBe('Tokyo Hotel');
    expect(result[0]!.items).toHaveLength(1);
    expect(result[0]!.items[0]!.title).toBe('Sushi Lunch');

    expect(result[1]!.stay.title).toBe('Osaka Hotel');
    expect(result[1]!.items).toHaveLength(1);
    expect(result[1]!.items[0]!.title).toBe('Castle Tour');
  });
});
