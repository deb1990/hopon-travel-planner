import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ItineraryHeader } from './itinerary-header';
import { ThemeProvider } from '@/components/providers/theme-provider';

describe('ItineraryHeader', () => {
  it('should render trip name and ID', () => {
    render(
      <ThemeProvider attribute="class">
        <ItineraryHeader tripName="Japan 2026" tripId="trip-12345678" />
      </ThemeProvider>,
    );
    expect(screen.getByText('Japan 2026')).toBeInTheDocument();
    expect(screen.getByText('trip-12345678')).toBeInTheDocument();
  });
});
