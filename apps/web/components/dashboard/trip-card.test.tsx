import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TripCard } from './trip-card';
import { Trip } from '@hopon/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const mockTrip: Trip = {
  id: 'trip-123',
  ownerId: 'user-1',
  name: 'Alpine Adventure',
  visibility: 'private',
  createdAt: '2026-05-01T10:00:00Z',
  updatedAt: '2026-05-01T10:00:00Z',
};

const queryClient = new QueryClient();

describe('TripCard', () => {
  it('should render the trip name and formatted creation date', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TripCard trip={mockTrip} />
      </QueryClientProvider>,
    );

    expect(screen.getByText('Alpine Adventure')).toBeInTheDocument();
    expect(screen.getByText('Created May 1')).toBeInTheDocument();
  });

  it('should contain a link to the trip details', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TripCard trip={mockTrip} />
      </QueryClientProvider>,
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/trips/trip-123');
  });

  it('should render the planned date range when provided', () => {
    const tripWithDates: Trip = {
      ...mockTrip,
      startDate: '2026-10-01T00:00:00Z',
      endDate: '2026-10-05T00:00:00Z',
    };

    render(
      <QueryClientProvider client={queryClient}>
        <TripCard trip={tripWithDates} />
      </QueryClientProvider>,
    );

    expect(screen.getByText('Oct 1 — Oct 5')).toBeInTheDocument();
  });
});
