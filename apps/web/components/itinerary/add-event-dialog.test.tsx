import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AddEventDialog } from './add-event-dialog';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

describe('AddEventDialog Component', () => {
  it('should render as "Add Stay" when type is STAY', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddEventDialog tripId="trip-1" type="STAY" />
      </QueryClientProvider>,
    );

    const trigger = screen.getByRole('button', { name: /Add Stay/i });
    fireEvent.click(trigger);

    expect(screen.getByText(/Accommodation Name/i)).toBeInTheDocument();
    // Separate Location and Title fields
    expect(screen.getByPlaceholderText(/e.g. Viking Museum/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. The Thief Hotel/i)).toBeInTheDocument();
  });

  it('should render as "Add Activity" when type is ACTIVITY', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AddEventDialog tripId="trip-1" type="ACTIVITY" />
      </QueryClientProvider>,
    );

    const trigger = screen.getByRole('button', { name: /Add Activity/i });
    fireEvent.click(trigger);

    expect(screen.getByText(/New Activity/i)).toBeInTheDocument();
    // Separate Location and Title fields
    expect(screen.getByPlaceholderText(/e.g. Viking Museum/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. Sushi Dinner/i)).toBeInTheDocument();
  });
});
