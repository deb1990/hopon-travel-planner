import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GhostGroup } from './ghost-group';

describe('GhostGroup Component', () => {
  it('should render stay-centric title and chronological days', () => {
    // Gap from Oct 3rd to Oct 5th (2 Days)
    const startTime = '2026-10-03T11:00:00Z';
    const numDays = 2;

    render(<GhostGroup startTime={startTime} numDays={numDays} />);

    // Verify Refined Title
    expect(screen.getByText(/Stay Not Assigned/i)).toBeInTheDocument();

    // Verify specific dates
    expect(screen.getByText(/Oct 3, 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/Saturday/i)).toBeInTheDocument();

    // Verify "No activities" placeholders
    expect(screen.getAllByText(/No activities planned/i)).toHaveLength(2);

    // Verify Home icon is NOT present (Minimalist requirement)
    expect(screen.queryByTestId('home-icon')).toBeNull();
  });
});
