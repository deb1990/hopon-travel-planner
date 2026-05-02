import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ItineraryHeader } from './itinerary-header';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Trip } from '@hopon/core';

const queryClient = new QueryClient();

const mockTrip: Trip = {
  id: 'trip-12345678',
  ownerId: 'user-1',
  name: 'Japan 2026',
  visibility: 'private',
  createdAt: '2026-05-01T10:00:00Z',
  updatedAt: '2026-05-01T10:00:00Z',
};

describe('ItineraryHeader', () => {
  it('should render the trip name and ID correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class">
          <ItineraryHeader trip={mockTrip} tripId="trip-12345678" />
        </ThemeProvider>
      </QueryClientProvider>,
    );
    expect(screen.getByText('Japan 2026')).toBeInTheDocument();
    expect(screen.getByText('trip-12345678')).toBeInTheDocument();
  });
});
