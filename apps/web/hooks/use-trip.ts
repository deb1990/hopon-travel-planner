import { useQuery } from '@tanstack/react-query';
import { Trip, ItineraryEvent } from '@hopon/core';
import { CONFIG } from '@/lib/config';

/**
 * Interface representing a trip with its nested events.
 */
export interface TripWithEvents extends Trip {
  events: ItineraryEvent[];
}

/**
 * Hook for fetching a single trip and its events.
 *
 * @param tripId - Unique identifier for the trip.
 * @returns React Query object with TripWithEvents data.
 */
export function useTrip(tripId: string) {
  return useQuery<TripWithEvents>({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      const res = await fetch(`${CONFIG.API_URL}/trips/${tripId}`, {
        headers: { 'x-user-id': CONFIG.DEMO_USER_ID },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    },
    enabled: !!tripId,
  });
}
