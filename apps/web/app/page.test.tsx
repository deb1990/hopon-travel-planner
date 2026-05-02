import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, type Mock } from 'vitest';
import Dashboard from './page';
import QueryProvider from '@/components/providers/query-provider';

// Mock useParams/useRouter
vi.mock('next/navigation', () => ({
  useParams: () => ({}),
  useRouter: () => ({ push: vi.fn() }),
}));

// Mock the fetch call
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  }),
) as Mock;

describe('Main Dashboard Integrity', () => {
  it('should render the dashboard without crashing', () => {
    const { container } = render(
      <QueryProvider>
        <Dashboard />
      </QueryProvider>,
    );
    expect(container).toBeDefined();
  });
});
