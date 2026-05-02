import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TripDetail from './page';
import { useTrip } from '@/hooks/use-trip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock hooks
vi.mock('@/hooks/use-trip');
vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 'trip-123' }),
}));

const queryClient = new QueryClient();

describe('TripDetail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the empty itinerary state when no events exist', () => {
    (useTrip as any).mockReturnValue({
      data: { id: 'trip-123', name: 'New Trip', events: [] },
      isLoading: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TripDetail />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/Empty Itinerary/i)).toBeInTheDocument();
    expect(screen.getByText(/Create First Entry/i)).toBeInTheDocument();
  });

  it('should calculate and display the correct duration', () => {
    (useTrip as any).mockReturnValue({
      data: {
        id: 'trip-123',
        name: 'Long Trip',
        startDate: '2026-05-01',
        endDate: '2026-05-10',
        events: [],
      },
      isLoading: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TripDetail />
      </QueryClientProvider>,
    );

    // Duration is 10 days (inclusive)
    expect(screen.getByText('10')).toBeInTheDocument();
  });
});
