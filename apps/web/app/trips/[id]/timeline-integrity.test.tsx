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

describe('Timeline Day-Centric Integrity', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render days and transition stays correctly', async () => {
    // SCENARIO:
    // Trip: June 18 to June 20
    // Stay 1: Hotel A (18-19)
    // Stay 2: Hotel B (19-20)

    (useTrip as any).mockReturnValue({
      data: {
        id: 'trip-integrity',
        name: 'Day-Centric Test',
        startDate: '2026-06-18T00:00:00Z',
        endDate: '2026-06-20T00:00:00Z',
        events: [
          {
            id: 's1',
            type: 'STAY',
            title: 'Hotel A',
            startTime: '2026-06-18T15:00:00Z',
            endTime: '2026-06-19T11:00:00Z',
            isLocked: false,
          },
          {
            id: 's2',
            type: 'STAY',
            title: 'Hotel B',
            startTime: '2026-06-19T15:00:00Z',
            endTime: '2026-06-20T11:00:00Z',
            isLocked: false,
          },
          {
            id: 'a1',
            type: 'ACTIVITY',
            title: 'Museum',
            startTime: '2026-06-19T12:00:00Z',
            isLocked: false,
          },
        ],
      },
      isLoading: false,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TripDetail />
      </QueryClientProvider>,
    );

    // June 18th
    expect(screen.getByText(/Jun 18, 2026/i)).toBeInTheDocument();

    // June 19th (TRANSITION)
    expect(screen.getByText(/Jun 19, 2026/i)).toBeInTheDocument();
    // Should see both hotels on June 19th
    const hotelsOn19th = screen.getAllByText(/Hotel/i);
    expect(hotelsOn19th.length).toBeGreaterThanOrEqual(2);

    // Activity should be present
    expect(screen.getByText(/Museum/i)).toBeInTheDocument();
  });
});
