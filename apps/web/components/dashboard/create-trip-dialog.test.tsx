import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

    // Submit
    fireEvent.click(screen.getByText('Create Journey'));

    expect(screen.getByText(/must be at least 3 characters/i)).toBeInTheDocument();
  });

  it('should show an error if the journey name is empty', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <CreateTripDialog />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByText('New Journey'));
    fireEvent.click(screen.getByText('Create Journey'));

    expect(screen.getByText(/provide a name for your journey/i)).toBeInTheDocument();
  });
});
