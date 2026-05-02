import { render, screen, within } from '@testing-library/react';
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
    // 5. Ghost (Jun 10-11) -> THE END GAP

    (useTrip as any).mockReturnValue({
      data: {
        id: 'trip-integrity',
        name: 'Section Test',
        startDate: '2026-06-01T00:00:00Z',
        endDate: '2026-06-11T00:00:00Z', // 11 Days
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

    const timeline = screen.getByTestId('timeline-list');
    const sections = within(timeline).getAllByTestId(/ghost-group|base-group/);

    // VERIFY COUNT
    expect(sections).toHaveLength(5);

    // VERIFY SEQUENCE DATA
    // Section 1: Start Gap
    expect(sections[0]).toHaveAttribute('data-testid', 'ghost-group');
    expect(within(sections[0]!).getByText(/Jun 1, 2026/i)).toBeInTheDocument();

    // Section 2: Tokyo
    expect(sections[1]).toHaveAttribute('data-testid', 'base-group');
    expect(within(sections[1]!).getByText(/Tokyo Hotel/i)).toBeInTheDocument();

    // Section 3: Middle Gap
    expect(sections[2]).toHaveAttribute('data-testid', 'ghost-group');
    expect(within(sections[2]!).getByText(/Jun 6, 2026/i)).toBeInTheDocument();

    // Section 4: Osaka
    expect(sections[3]).toHaveAttribute('data-testid', 'base-group');
    expect(within(sections[3]!).getByText(/Osaka Hotel/i)).toBeInTheDocument();

    // Section 5: End Gap
    expect(sections[4]).toHaveAttribute('data-testid', 'ghost-group');
    expect(within(sections[4]!).getByText(/Jun 10, 2026/i)).toBeInTheDocument();
  });
});
