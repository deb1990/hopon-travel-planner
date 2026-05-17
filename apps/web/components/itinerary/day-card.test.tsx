import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DayCard } from './day-card';
import { DayGroup, StayEvent } from '@hopon/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe('DayCard Component', () => {
  const tripId = 't1';
  const date = '2026-06-19T00:00:00Z';

  it('should render stay badges correctly on a transition day', () => {
    const stay1: StayEvent = {
      id: 's1',
      type: 'STAY',
      title: 'Hotel A',
      tripId,
      startTime: '2026-06-18T15:00:00Z',
      endTime: '2026-06-19T11:00:00Z',
      isLocked: false,
    };
    const stay2: StayEvent = {
      id: 's2',
      type: 'STAY',
      title: 'Hotel B',
      tripId,
      startTime: '2026-06-19T15:00:00Z',
      endTime: '2026-06-20T11:00:00Z',
      isLocked: false,
    };

    const day: DayGroup = {
      date,
      items: [],
      activeStays: [stay1, stay2],
    };

    render(
      <QueryClientProvider client={queryClient}>
        <DayCard day={day} tripId={tripId} />
      </QueryClientProvider>,
    );

    // Verify both hotels are shown as context
    expect(screen.getByText(/Hotel A/i)).toBeInTheDocument();
    expect(screen.getByText(/Hotel B/i)).toBeInTheDocument();
  });

  it('should show the "No Accommodation" warning when activeStays is empty', () => {
    const day: DayGroup = {
      date,
      items: [],
      activeStays: [],
    };

    render(
      <QueryClientProvider client={queryClient}>
        <DayCard day={day} tripId={tripId} />
      </QueryClientProvider>,
    );

    expect(screen.getByText(/No Accommodation/i)).toBeInTheDocument();
  });
});
