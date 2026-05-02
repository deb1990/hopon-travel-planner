import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from './page';
import QueryProvider from '@/components/providers/query-provider';

// Mock useParams
vi.mock('next/navigation', () => ({
  useParams: () => ({ id: 'trip-1' }),
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock the fetch call
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        id: 'trip-1',
        name: 'Single Trip Test',
        events: [],
      }),
  }),
) as any;

describe('Dashboard Page Integrity', () => {
  it('should render the dashboard without crashing', () => {
    const { container } = render(
      <QueryProvider>
        <Home />
      </QueryProvider>,
    );
    expect(container).toBeDefined();
  });
});
