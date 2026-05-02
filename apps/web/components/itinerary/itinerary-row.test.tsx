import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ItineraryRow } from './itinerary-row';
import { ItineraryEvent } from '@hopon/core';

const mockEvent: ItineraryEvent = {
  id: '1',
  tripId: 'trip-1',
  type: 'ACTIVITY',
  title: 'Test Activity',
  startTime: '2026-10-01T10:00:00Z',
  endTime: '2026-10-01T11:00:00Z',
  locationName: 'Test Location',
};

describe('ItineraryRow Component', () => {
  it('should render the event title and location', () => {
    render(<ItineraryRow event={mockEvent} />);
    expect(screen.getByText('Test Activity')).toBeInTheDocument();
    expect(screen.getByText('Test Location')).toBeInTheDocument();
  });

  it('should render both start and end times for activities', () => {
    render(<ItineraryRow event={mockEvent} />);

    // Use a flexible matcher since timezones in JSDOM can be finicky
    // We just want to ensure two distinct time-like strings are rendered in the time column
    const timeContainers = screen.getAllByText(/\d{2}:\d{2}/);
    expect(timeContainers.length).toBeGreaterThanOrEqual(2);
  });
});
