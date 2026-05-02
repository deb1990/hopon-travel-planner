import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from './page';
import QueryProvider from '@/components/providers/query-provider';

// Mock the fetch call
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  }),
) as any;

describe('Dashboard Page Integrity', () => {
  it('should render the dashboard without crashing', () => {
    // We wrap in QueryProvider because Home uses useQuery
    const { container } = render(
      <QueryProvider>
        <Home />
      </QueryProvider>,
    );
    expect(container).toBeDefined();
  });
});
