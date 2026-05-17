import { describe, it, expect } from 'vitest';
import { groupEventsByDay } from './grouping';
import { ItineraryEvent, StayEvent } from '../types';

describe('Day-Centric Grouping Logic', () => {
  const stay1: StayEvent = {
    id: 's1',
    tripId: 't1',
    type: 'STAY',
    title: 'Hotel A',
    startTime: '2026-06-18T15:00:00Z',
    endTime: '2026-06-19T11:00:00Z',
    isLocked: false,
  };

  const stay2: StayEvent = {
    id: 's2',
    tripId: 't1',
    type: 'STAY',
    title: 'Hotel B',
    startTime: '2026-06-19T15:00:00Z',
    endTime: '2026-06-20T11:00:00Z',
    isLocked: false,
  };

  const activity1: ItineraryEvent = {
    id: 'a1',
    tripId: 't1',
    type: 'ACTIVITY',
    title: 'Dinner',
    startTime: '2026-06-18T19:00:00Z',
    isLocked: false,
  };

  const activity2: ItineraryEvent = {
    id: 'a2',
    tripId: 't1',
    type: 'ACTIVITY',
    title: 'Lunch',
    startTime: '2026-06-19T12:00:00Z',
    isLocked: false,
  };

  it('should correctly handle a transition day (June 19th) with two stays', () => {
    const events = [stay1, stay2, activity1, activity2];
    const result = groupEventsByDay(events, '2026-06-18T00:00:00Z', '2026-06-20T00:00:00Z');

    // Expected Days: 18, 19, 20
    expect(result).toHaveLength(3);

    // June 18th
    expect(result[0]!.date).toContain('06-18');
    expect(result[0]!.activeStays).toHaveLength(1);
    expect(result[0]!.activeStays[0]!.id).toBe('s1');
    expect(result[0]!.items).toHaveLength(1); // Dinner

    // June 19th (TRANSITION DAY)
    expect(result[1]!.date).toContain('06-19');
    expect(result[1]!.activeStays).toHaveLength(2); // Both s1 (checkout) and s2 (checkin)
    expect(result[1]!.items).toHaveLength(1); // Lunch

    // June 20th
    expect(result[2]!.date).toContain('06-20');
    expect(result[2]!.activeStays).toHaveLength(1);
    expect(result[2]!.activeStays[0]!.id).toBe('s2');
  });
});
