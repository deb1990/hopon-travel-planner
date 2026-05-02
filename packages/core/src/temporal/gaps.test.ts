import { describe, it, expect } from 'vitest';
import { ItineraryEvent } from '../types';
import { identifyItineraryGaps } from './gaps';

describe('Gap Detection Logic (Comprehensive)', () => {
  const mockStays: ItineraryEvent[] = [
    {
      id: 's1',
      tripId: 't1',
      type: 'STAY',
      title: 'First Hotel',
      startTime: '2026-10-03T15:00:00Z',
      endTime: '2026-10-05T11:00:00Z',
    },
  ];

  it('should identify a gap at the START if trip starts before first stay', () => {
    const tripStart = '2026-10-01T00:00:00Z';
    const result = identifyItineraryGaps(mockStays, tripStart);

    expect(result).toHaveLength(1);
    expect(result[0]!.numDays).toBe(2); // Oct 1, Oct 2
    expect(result[0]!.startTime).toBe(tripStart);
  });

  it('should identify a gap at the END if trip ends after last stay', () => {
    const tripEnd = '2026-10-07T23:59:59Z';
    const result = identifyItineraryGaps(mockStays, undefined, tripEnd);

    expect(result).toHaveLength(1);
    expect(result[0]!.numDays).toBe(2); // Oct 5, Oct 6 (Oct 7 check-in would be needed)
    expect(new Date(result[0]!.startTime).getUTCDate()).toBe(5);
  });

  it('should identify middle gaps between stays', () => {
    const events: ItineraryEvent[] = [
      ...mockStays,
      {
        id: 's2',
        tripId: 't1',
        type: 'STAY',
        title: 'Second Hotel',
        startTime: '2026-10-07T15:00:00Z',
        endTime: '2026-10-10T11:00:00Z',
      },
    ];
    const result = identifyItineraryGaps(events);
    expect(result).toHaveLength(1);
    expect(result[0]!.numDays).toBe(2); // Oct 5, Oct 6
  });
});
