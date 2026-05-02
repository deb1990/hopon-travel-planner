import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DeleteTripDialog } from './delete-trip-dialog';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const queryClient = new QueryClient();

describe('DeleteTripDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show confirmation message with trip name', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <DeleteTripDialog tripId="1" tripName="Trip to Delete" />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole('button')); // The trash icon button
    expect(screen.getByText(/Are you sure you want to delete/i)).toBeInTheDocument();
    expect(screen.getByText('Trip to Delete')).toBeInTheDocument();
  });
});
