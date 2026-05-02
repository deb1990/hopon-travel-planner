import { useQuery } from '@tanstack/react-query';
import { Trip, ItineraryEvent } from '@hopon/core';

// Define a type that represents the full trip payload from the API
export interface TripWithEvents extends Trip {
  events: ItineraryEvent[];
}

const DEMO_USER_ID = 'b07bb29b-67de-4f35-8c85-111c8358436b';
const API_URL = 'http://localhost:4000';

/**
 * Hook for fetching a single trip and its events.
 */
export function useTrip(tripId: string) {
  return useQuery<TripWithEvents>({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/trips/${tripId}`, {
        headers: { 'x-user-id': DEMO_USER_ID },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.json();
    },
    enabled: !!tripId,
  });
}
