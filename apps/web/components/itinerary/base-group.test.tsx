import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BaseGroup } from './base-group';
import { ItineraryEvent } from '@hopon/core';

const mockStay: ItineraryEvent = {
  id: 'stay-1',
  tripId: 'trip-1',
  type: 'STAY',
  title: 'Test Hotel',
  startTime: '2026-10-01T15:00:00Z',
  endTime: '2026-10-03T11:00:00Z', // 3 Days: Oct 1, 2, 3
  locationName: 'Test City',
};

const mockActivities: ItineraryEvent[] = [
  {
    id: 'act-1',
    tripId: 'trip-1',
    type: 'ACTIVITY',
    title: 'Nested Activity',
    startTime: '2026-10-01T10:00:00Z',
  },
];

describe('BaseGroup Component', () => {
  it('should render chronological date markers and empty messages for inactive days', () => {
    render(<BaseGroup stay={mockStay} items={mockActivities} />);

    // Oct 1 (Has activity)
    expect(screen.getByText(/Nested Activity/i)).toBeInTheDocument();

    // Check for both Date and Day name in the document
    expect(screen.getByText(/Oct 2, 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/Friday/i)).toBeInTheDocument();

    // Should find exactly 2 empty day placeholders
    const placeholders = screen.getAllByText(/No activities planned/i);
    expect(placeholders).toHaveLength(2);
  });
});
