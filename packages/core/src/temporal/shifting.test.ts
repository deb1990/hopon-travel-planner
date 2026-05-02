import { describe, it, expect } from 'vitest';
import { ItineraryEvent } from '../types';
import { shiftEvents } from './shifting';

describe('Event Shifting Logic', () => {
  it('should shift all unlocked events by the given offset', () => {
    const events: ItineraryEvent[] = [
      {
        id: 'stay-1',
        tripId: 't1',
        type: 'STAY',
        title: 'Hotel',
        startTime: '2026-10-01T15:00:00Z',
        endTime: '2026-10-05T10:00:00Z',
        isLocked: false,
      },
      {
        id: 'locked-1',
        tripId: 't1',
        type: 'ACTIVITY',
        title: 'Flight',
        startTime: '2026-10-02T10:00:00Z',
        isLocked: true, // Should NOT shift
      },
    ];

    const offsetMs = 24 * 60 * 60 * 1000; // 1 day
    const result = shiftEvents(events, offsetMs);

    const shiftedStay = result.find((e) => e.id === 'stay-1');
    const lockedEvent = result.find((e) => e.id === 'locked-1');

    // Stay should be shifted
    expect(shiftedStay?.startTime).toBe('2026-10-02T15:00:00.000Z');

    // Locked event should remain unchanged
    expect(lockedEvent?.startTime).toBe('2026-10-02T10:00:00Z');
  });
});
