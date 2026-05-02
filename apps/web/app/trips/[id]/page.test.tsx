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

  it('should render multiple base groups and an inter-stay gap', () => {
    (useTrip as any).mockReturnValue({
      data: {
        id: 'trip-123',
        name: 'Japan',
        events: [
          {
            id: 's1',
            type: 'STAY',
            title: 'Tokyo Hotel',
            startTime: '2026-10-01T15:00:00Z',
            endTime: '2026-10-03T11:00:00Z',
          },
          {
            id: 's2',
            type: 'STAY',
            title: 'Osaka Hotel',
            startTime: '2026-10-05T15:00:00Z',
            endTime: '2026-10-07T11:00:00Z',
          },
          { id: 'a1', type: 'ACTIVITY', title: 'Sushi', startTime: '2026-10-02T12:00:00Z' },
        ],
      },
      isLoading: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TripDetail />
      </QueryClientProvider>,
    );

    // Verify both hotels exist
    expect(screen.getByText('Tokyo Hotel')).toBeInTheDocument();
    expect(screen.getByText('Osaka Hotel')).toBeInTheDocument();

    // Verify the "Base Not Assigned" alert exists for the gap (Oct 3 to Oct 5)
    expect(screen.getByText(/Base Not Assigned/i)).toBeInTheDocument();
    expect(screen.getByText(/2 Days unassigned/i)).toBeInTheDocument();
  });
});
