import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TripCard } from './trip-card';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Trip } from '@hopon/core';

const mockTrip: Trip = {
  id: 'trip-1',
  ownerId: 'user-1',
  name: 'Test Trip',
  startDate: '2026-05-01T00:00:00Z',
  endDate: '2026-05-10T00:00:00Z',
  visibility: 'private',
  createdAt: '2026-05-01T00:00:00Z',
  updatedAt: '2026-05-01T00:00:00Z',
};

const queryClient = new QueryClient();

describe('TripCard', () => {
  it('should render the trip name', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TripCard trip={mockTrip} />
      </QueryClientProvider>,
    );
    expect(screen.getByText('Test Trip')).toBeInTheDocument();
  });
});
