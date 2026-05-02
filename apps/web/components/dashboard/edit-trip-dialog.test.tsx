import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EditTripDialog } from './edit-trip-dialog';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Trip } from '@hopon/core';

const queryClient = new QueryClient();

const mockTrip: Trip = {
  id: 'trip-1',
  ownerId: 'user-1',
  name: 'Original Name',
  startDate: '2026-05-01T00:00:00Z',
  endDate: '2026-05-10T00:00:00Z',
  visibility: 'private',
  createdAt: '2026-05-01T00:00:00Z',
  updatedAt: '2026-05-01T00:00:00Z',
};

describe('EditTripDialog', () => {
  it('should render the trigger button', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EditTripDialog trip={mockTrip} />
      </QueryClientProvider>,
    );
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
