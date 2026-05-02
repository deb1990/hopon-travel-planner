import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ItineraryRow } from './itinerary-row';
import { ItineraryEvent } from '@hopon/core';

describe('ItineraryRow', () => {
  const mockEvent: ItineraryEvent = {
    id: '1',
    tripId: 'trip-1',
    type: 'ACTIVITY',
    title: 'Visit Louvre',
    startTime: '2026-10-01T10:00:00Z',
    locationName: 'Louvre Museum',
  };

  it('should render the event title and type', () => {
    render(<ItineraryRow event={mockEvent} />);
    expect(screen.getByText('Visit Louvre')).toBeInTheDocument();
    expect(screen.getByText('ACTIVITY')).toBeInTheDocument();
    expect(screen.getByText('Louvre Museum')).toBeInTheDocument();
  });

  it('should apply special styling for STAY type', () => {
    const stayEvent: ItineraryEvent = { ...mockEvent, type: 'STAY' };
    const { container } = render(<ItineraryRow event={stayEvent} />);
    expect(container.firstChild).toHaveClass('bg-primary/[0.02]');
  });
});
