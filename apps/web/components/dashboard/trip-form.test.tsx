import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TripForm } from './trip-form';

describe('TripForm', () => {
  it('should call onSubmit with valid data', async () => {
    const onSubmit = vi.fn();
    render(<TripForm onSubmit={onSubmit} isPending={false} submitLabel="Confirm" />);

    fireEvent.change(screen.getByLabelText(/Journey Name/i), {
      target: { value: 'New Adventure' },
    });

    // Explicitly submit the form
    fireEvent.submit(screen.getByLabelText('trip-form'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New Adventure',
        }),
      );
    });
  });

  it('should prevent selection of end date before start date', async () => {
    const onSubmit = vi.fn();
    render(<TripForm onSubmit={onSubmit} isPending={false} submitLabel="Confirm" />);

    fireEvent.change(screen.getByLabelText(/Journey Name/i), {
      target: { value: 'Valid Journey' },
    });
    fireEvent.change(screen.getByLabelText(/Start Date/i), { target: { value: '2026-10-10' } });
    fireEvent.change(screen.getByLabelText(/End Date/i), { target: { value: '2026-10-05' } });

    fireEvent.submit(screen.getByLabelText('trip-form'));

    const errorEl = await screen.findByTestId('error-message');
    expect(errorEl).toHaveTextContent(/cannot be before start date/i);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
