'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TripCard } from '@/components/dashboard/trip-card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Globe } from 'lucide-react';

const DEMO_USER_ID = 'b07bb29b-67de-4f35-8c85-111c8358436b';
const API_URL = 'http://localhost:4000';

export default function Dashboard() {
  const queryClient = useQueryClient();

  const { data: trips, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/trips`, {
        headers: { 'x-user-id': DEMO_USER_ID },
      });
      if (!res.ok) throw new Error('Failed to fetch trips');
      return res.json();
    },
  });

  const createTripMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/trips`, {
        method: 'POST',
        headers: {
          'x-user-id': DEMO_USER_ID,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: `New Trip ${new Date().toLocaleDateString()}` }),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40 w-full" />
        ))}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border/50 px-8 py-12">
        <div className="max-w-6xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase text-primary italic">
              Hop On
            </h1>
            <p className="text-muted-foreground text-sm uppercase tracking-widest mt-2 font-medium">
              Global Itinerary Manager
            </p>
          </div>
          <Button
            onClick={() => createTripMutation.mutate()}
            disabled={createTripMutation.isPending}
            className="rounded-full px-6 font-bold"
          >
            <Plus className="size-4 mr-2" />
            New Trip
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto w-full p-8">
        <div className="flex items-center gap-2 mb-8">
          <Globe className="size-4 text-primary" />
          <h2 className="text-xs uppercase font-bold tracking-[0.2em] text-zinc-500">
            Your Journeys
          </h2>
        </div>

        {trips?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip: any) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-zinc-800 rounded-3xl">
            <p className="text-zinc-600 font-medium italic">Your map is empty. Where to first?</p>
          </div>
        )}
      </div>
    </main>
  );
}
