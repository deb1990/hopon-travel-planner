import { describe, it, expect } from 'vitest';
import { calculateTripDuration } from './temporal-utils';

describe('calculateTripDuration', () => {
  it('should return 1 if dates are missing', () => {
    expect(calculateTripDuration()).toBe(1);
  });

  it('should return 1 if start and end are the same day', () => {
    const date = '2026-05-01T10:00:00Z';
    expect(calculateTripDuration(date, date)).toBe(1);
  });

  it('should return 3 for a 3-day trip (inclusive)', () => {
    expect(calculateTripDuration('2026-05-01', '2026-05-03')).toBe(3);
  });

  it('should handle ISO strings with times correctly', () => {
    expect(calculateTripDuration('2026-05-01T23:00:00Z', '2026-05-02T01:00:00Z')).toBe(2);
  });
});
