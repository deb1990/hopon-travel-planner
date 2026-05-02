import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, type Mock } from 'vitest';
import { useTrips } from './use-trips';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

// Mock fetch
global.fetch = vi.fn();

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

describe('useTrips Hook', () => {
  it('should fetch all trips successfully', async () => {
    const mockTrips = [{ id: 'trip-1', name: 'Test Trip' }];
    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTrips,
    });

    const queryClient = createTestQueryClient();
    const { result } = renderHook(() => useTrips(), {
      wrapper: ({ children }) =>
        React.createElement(QueryClientProvider, { client: queryClient, children }, children),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockTrips);
  });
});
