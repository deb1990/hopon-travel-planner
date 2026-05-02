import { describe, it, expect } from 'vitest';
import { calculateDroppedTime } from './reordering';

describe('Itinerary Reordering Logic', () => {
  it('should calculate time for a drop onto a new date (start of day)', () => {
    const targetDate = '2026-06-05T00:00:00Z';
    // If dropped on a date with no neighbors, default to 09:00 AM on that day
    const result = calculateDroppedTime(targetDate);
    expect(result).toBe('2026-06-05T09:00:00.000Z');
  });

  it('should calculate time when dropped between two existing activities', () => {
    const prevTime = '2026-06-05T10:00:00Z';
    const nextTime = '2026-06-05T12:00:00Z';
    // Should split the difference -> 11:00 AM
    const result = calculateDroppedTime('2026-06-05', prevTime, nextTime);
    expect(result).toBe('2026-06-05T11:00:00.000Z');
  });
});
