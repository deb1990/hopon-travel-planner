import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GhostGroup } from './ghost-group';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe('GhostGroup Component', () => {
  it('should render stay-centric title and Add Stay button', () => {
    // Gap from Oct 3rd to Oct 5th (2 Days)
    const startTime = '2026-10-03T11:00:00Z';
    const numDays = 2;

    render(
      <QueryClientProvider client={queryClient}>
        <GhostGroup tripId="trip-1" startTime={startTime} numDays={numDays} />
      </QueryClientProvider>,
    );

    // Verify Title
    expect(screen.getByText(/Stay Not Assigned/i)).toBeInTheDocument();

    // Verify "Add Stay" button in the header
    expect(screen.getByText(/Add Stay/i)).toBeInTheDocument();

    // Verify "Add Activity" buttons (one for each day of the gap)
    expect(screen.getAllByText(/Add Activity/i)).toHaveLength(2);
  });
});
