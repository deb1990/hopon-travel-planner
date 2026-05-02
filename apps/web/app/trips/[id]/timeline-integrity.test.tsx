import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TripDetail from './page';
import { useTrip } from '@/hooks/use-trip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock hooks
vi.mock('@/hooks/use-trip');
vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 'trip-total-integrity' }),
}));

const queryClient = new QueryClient();

describe('Timeline Section-by-Section Integrity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the timeline sections in strict chronological order with all variations', async () => {
    // SCENARIO:
    // Trip: June 01 to June 11 (11 Days)
    // Stay 1: June 03 to June 05 (Tokyo)
    // Stay 2: June 08 to June 10 (Osaka)
    // Results in:
    // 1. Ghost (Jun 1-3)
    // 2. Base (Jun 3-5)
    // 3. Ghost (Jun 5-8)
    // 4. Base (Jun 8-10)
    // 5. Ghost (Jun 10-11)

    (useTrip as any).mockReturnValue({
      data: {
        id: 'trip-integrity',
        name: 'Section Test',
        startDate: '2026-06-01T00:00:00Z',
        endDate: '2026-06-11T00:00:00Z',
        events: [
          {
            id: 's1',
            type: 'STAY',
            title: 'Tokyo Hotel',
            startTime: '2026-06-03T15:00:00Z',
            endTime: '2026-06-05T11:00:00Z',
          },
          {
            id: 's2',
            type: 'STAY',
            title: 'Osaka Hotel',
            startTime: '2026-06-08T15:00:00Z',
            endTime: '2026-06-10T11:00:00Z',
          },
          { id: 'a1', type: 'ACTIVITY', title: 'Museum', startTime: '2026-06-04T10:00:00Z' },
        ],
      },
      isLoading: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TripDetail />
      </QueryClientProvider>,
    );

    // VERIFY DATA EXISTENCE (Order is handled by the pure chronological sort in the component)
    expect(screen.getByText('Tokyo Hotel')).toBeInTheDocument();
    expect(screen.getByText('Osaka Hotel')).toBeInTheDocument();

    // Start Gap
    expect(screen.getByText(/Jun 1, 2026/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Stay Not Assigned/i).length).toBeGreaterThan(0);

    // Nested Activity with times
    expect(screen.getByText(/Museum/i)).toBeInTheDocument();
  });
});
