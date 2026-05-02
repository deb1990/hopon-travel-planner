import { useQuery } from '@tanstack/react-query';
import { Trip } from '@hopon/core';
import { CONFIG } from '@/lib/config';

/**
 * Hook for fetching all trips accessible to the current user.
 */
export function useTrips() {
  return useQuery<Trip[]>({
    queryKey: ['trips'],
    queryFn: async () => {
      const res = await fetch(`${CONFIG.API_URL}/trips`, {
        headers: { 'x-user-id': CONFIG.DEMO_USER_ID },
      });
      if (!res.ok) throw new Error('Failed to fetch trips');
      return res.json();
    },
  });
}
