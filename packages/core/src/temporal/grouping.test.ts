import { describe, it, expect } from 'vitest';
import { ItineraryEvent } from '../types';
import { groupEventsByDay } from './grouping';

describe('Event Grouping Logic', () => {
  it('should group activities under their calendar day', () => {
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
    ];

    const result = groupEventsByDay(events, '2026-10-01T00:00:00Z', '2026-10-05T00:00:00Z');

    expect(result).toHaveLength(5);
    // Oct 2nd (Index 1)
    expect(result[1]!.items).toHaveLength(1);
    expect(result[1]!.items[0]!.title).toBe('Sushi Lunch');
    expect(result[1]!.activeStays).toHaveLength(1);
    expect(result[1]!.activeStays[0]!.title).toBe('Tokyo Hotel');
  });
});
