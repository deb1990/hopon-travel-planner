import { describe, it, expect } from 'vitest';
import { reorderTimeline } from './reordering';
import { ItineraryEvent } from '../types';

describe('Timeline Reordering Engine (Push-Forward)', () => {
  const events: ItineraryEvent[] = [
    {
      id: 'a',
      type: 'ACTIVITY',
      title: 'Task A',
      startTime: '2026-06-05T10:00:00Z',
      endTime: '2026-06-05T11:00:00Z',
      tripId: 't1',
      isLocked: false,
    },
    {
      id: 'b',
      type: 'ACTIVITY',
      title: 'Task B',
      startTime: '2026-06-05T11:00:00Z',
      endTime: '2026-06-05T12:00:00Z',
      tripId: 't1',
      isLocked: false,
    },
    {
      id: 'c',
      type: 'ACTIVITY',
      title: 'Task C',
      startTime: '2026-06-05T12:00:00Z',
      endTime: '2026-06-05T13:00:00Z',
      tripId: 't1',
      isLocked: false,
    },
  ];

  it('should push subsequent items forward when moving an item to the start', () => {
    // Move C to A's spot (10:00)
    const result = reorderTimeline(events, 'c', 'a');

    // C takes 10:00 - 11:00
    expect(result[0]!.id).toBe('c');
    expect(result[0]!.startTime).toBe('2026-06-05T10:00:00.000Z');

    // A is pushed to 11:00 - 12:00
    expect(result[1]!.id).toBe('a');
    expect(result[1]!.startTime).toBe('2026-06-05T11:00:00.000Z');

    // B is pushed to 12:00 - 13:00
    expect(result[2]!.id).toBe('b');
    expect(result[2]!.startTime).toBe('2026-06-05T12:00:00.000Z');
  });

  it('should push subsequent items forward when moving an item middle-to-middle', () => {
    // Move A to B's spot (11:00)
    const result = reorderTimeline(events, 'a', 'b');

    // B should be pushed forward after A
    expect(result[0]!.id).toBe('a');
    expect(result[0]!.startTime).toBe('2026-06-05T11:00:00.000Z');

    expect(result[1]!.id).toBe('b');
    expect(result[1]!.startTime).toBe('2026-06-05T12:00:00.000Z');
  });
});
