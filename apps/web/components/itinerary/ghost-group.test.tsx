import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GhostGroup } from './ghost-group';

describe('GhostGroup Component', () => {
  it('should render stay-centric title and Add Stay button', () => {
    // Gap from Oct 3rd to Oct 5th (2 Days)
    const startTime = '2026-10-03T11:00:00Z';
    const numDays = 2;

    render(<GhostGroup startTime={startTime} numDays={numDays} />);

    // Verify Title
    expect(screen.getByText(/Stay Not Assigned/i)).toBeInTheDocument();

    // Verify "Add Stay" button in the header
    expect(screen.getByText(/Add Stay/i)).toBeInTheDocument();

    // Verify specific dates
    expect(screen.getByText(/Oct 3, 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/Saturday/i)).toBeInTheDocument();

    // Verify "Add Activity" buttons (one for each day of the gap)
    expect(screen.getAllByText(/Add Activity/i)).toHaveLength(2);
  });
});
