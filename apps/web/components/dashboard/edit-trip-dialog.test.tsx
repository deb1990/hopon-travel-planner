import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditTripDialog } from './edit-trip-dialog';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Trip } from '@hopon/core';

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockTrip: Trip = {
  id: 'trip-edit',
  ownerId: 'user-1',
  name: 'Original Name',
  visibility: 'private',
  createdAt: '2026-05-01T10:00:00Z',
  updatedAt: '2026-05-01T10:00:00Z',
};

const queryClient = new QueryClient();

describe('EditTripDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should pre-fill the form with existing trip data', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <EditTripDialog trip={mockTrip} />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole('button')); // The pencil icon button
    expect(screen.getByDisplayValue('Original Name')).toBeInTheDocument();
  });
});
