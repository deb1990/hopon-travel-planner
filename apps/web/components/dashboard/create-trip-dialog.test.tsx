import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CreateTripDialog } from './create-trip-dialog';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe('CreateTripDialog', () => {
  it('should show an error if the journey name is too short', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CreateTripDialog />
      </QueryClientProvider>,
    );

    // Open dialog
    fireEvent.click(screen.getByText('New Journey'));

    // Type a short name
    const input = screen.getByPlaceholderText(/e.g. Summer in Japan/i);
    fireEvent.change(input, { target: { value: 'Hi' } });

    // Submit - using getByRole to be precise
    const submitBtn = screen.getByRole('button', { name: /Create Journey/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('should show an error if the journey name is empty', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CreateTripDialog />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('New Journey'));
    const submitBtn = screen.getByRole('button', { name: /Create Journey/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/provide a name for your journey/i)).toBeInTheDocument();
    });
  });
});
