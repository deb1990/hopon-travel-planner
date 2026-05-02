import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, type Mock } from 'vitest';
import { useTrip } from './use-trip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock fetch
global.fetch = vi.fn();

// Create a clean QueryClient for each test with retries disabled
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('useTrip Hook', () => {
  it('should fetch trip data successfully', async () => {
    const mockTrip = { id: 'trip-1', name: 'Test Trip' };
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTrip,
    });

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useTrip('trip-1'), {
      wrapper: ({ children }) =>
        React.createElement(QueryProvider, { client: queryClient, children }, children),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockTrip);
  });

  it('should handle fetch errors', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useTrip('trip-1'), {
      wrapper: ({ children }) =>
        React.createElement(QueryProvider, { client: queryClient, children }, children),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeDefined();
  });

  it('should handle 403 Unauthorized correctly', async () => {
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      status: 403,
    });

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useTrip('private-trip'), {
      wrapper: ({ children }) =>
        React.createElement(QueryProvider, { client: queryClient, children }, children),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toContain('HTTP error! status: 403');
  });
});

// Local QueryProvider for testing
function QueryProvider({ children, client }: { children: React.ReactNode; client: QueryClient }) {
  return React.createElement(QueryClientProvider, { client }, children);
}
