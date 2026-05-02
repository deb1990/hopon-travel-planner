import { describe, it, expect } from 'vitest';
import { ItineraryEvent } from '../types';
import { shiftEvents } from './shifting';

describe('Time-Slice Shifting Logic', () => {
  const mockEvents: ItineraryEvent[] = [
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
      isLocked: true,
    },
  ];

  it('should shift all event times by a positive offset', () => {
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const result = shiftEvents(mockEvents, ONE_DAY_MS);

    expect(result[0]!.startTime).toBe('2026-10-02T10:00:00.000Z');
    expect(result[0]!.endTime).toBe('2026-10-06T10:00:00.000Z');
  });

  it('should shift all event times by a negative offset', () => {
    const ONE_DAY_MS = -(24 * 60 * 60 * 1000);
    const result = shiftEvents(mockEvents, ONE_DAY_MS);

    expect(result[0]!.startTime).toBe('2026-09-30T10:00:00.000Z');
  });

  it('should not change anything with a zero offset', () => {
    const result = shiftEvents(mockEvents, 0);
    expect(result[0]!.startTime).toBe(mockEvents[0]!.startTime);
  });

  it('should RESPECT the isLocked flag and NOT shift locked events', () => {
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;
    const result = shiftEvents(mockEvents, ONE_DAY_MS);

    // Stay-1 is not locked -> Should be shifted
    expect(result[0]!.startTime).toBe('2026-10-02T10:00:00.000Z');

    // Act-1 IS LOCKED -> Should remain at Oct 2nd
    expect(result[1]!.startTime).toBe('2026-10-02T10:00:00Z');
  });
});
