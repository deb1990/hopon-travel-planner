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

  it('should render Day Groups and Stay Badges correctly', async () => {
    const mockTrip = {
      id: 'trip-123',
      name: 'Japan',
      startDate: '2026-05-01T00:00:00Z',
      endDate: '2026-05-05T00:00:00Z',
      events: [
        {
          id: 's1',
          type: 'STAY',
          title: 'Tokyo Hotel',
          startTime: '2026-05-01T15:00:00Z',
          endTime: '2026-05-03T11:00:00Z',
          isLocked: false,
        },
        {
          id: 's2',
          type: 'STAY',
          title: 'Osaka Hotel',
          startTime: '2026-05-03T15:00:00Z',
          endTime: '2026-05-05T11:00:00Z',
          isLocked: false,
        },
      ],
    };

    (useTrip as any).mockReturnValue({
      data: mockTrip,
      isLoading: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TripDetail />
      </QueryClientProvider>,
    );

    // Verify first day exists
    expect(screen.getByText(/May 1, 2026/i)).toBeInTheDocument();

    // Verify stays exist as badges
    expect(screen.getAllByText(/Tokyo Hotel/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Osaka Hotel/i).length).toBeGreaterThan(0);
  });
});
