'use client';

import { useQuery } from '@tanstack/react-query';
import { ItineraryRow } from '@/components/itinerary/itinerary-row';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin } from 'lucide-react';

// Mock user ID from our SEED process
const DEMO_USER_ID = 'b07bb29b-67de-4f35-8c85-111c8358436b';
const API_URL = 'http://localhost:4000';

export default function Home() {
  const { data: trips, isLoading } = useQuery({
    queryKey: ['trips'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/trips`, {
        headers: { 'x-user-id': DEMO_USER_ID },
      });
      return res.json();
    },
  });

  const tripId = trips?.[0]?.id;
  const { data: trip, isLoading: isLoadingTrip } = useQuery({
    queryKey: ['trip', tripId],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/trips/${tripId}`, {
        headers: { 'x-user-id': DEMO_USER_ID },
      });
      return res.json();
    },
    enabled: !!tripId,
  });

  if (isLoading || isLoadingTrip) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24 gap-4 bg-background text-foreground">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-md px-6 py-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight uppercase tracking-widest text-primary">
              {trip?.name || 'Hop On'}
            </h1>
            <p className="text-[10px] text-muted-foreground uppercase font-medium">
              Itinerary Planner / High Density View
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 uppercase tracking-tighter">
            <span>Status: Sync Active</span>
            <div className="size-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 flex flex-col gap-4">
            <Card className="border-none shadow-none bg-transparent">
              <CardHeader className="px-0 pb-2">
                <CardTitle className="text-xs uppercase text-zinc-500 tracking-widest font-bold">
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pt-0 flex flex-col border border-border/50 rounded-lg overflow-hidden">
                {trip?.events?.length > 0 ? (
                  trip.events.map((event: any) => <ItineraryRow key={event.id} event={event} />)
                ) : (
                  <div className="p-12 text-center text-muted-foreground text-sm border-dashed border-2 border-zinc-800 rounded-lg">
                    No events found. Start planning.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-6">
            <section className="flex flex-col gap-2">
              <h3 className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
                Summary
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-secondary/20 p-3 rounded-md border border-border/50">
                  <span className="text-[10px] uppercase block text-muted-foreground">Days</span>
                  <span className="text-xl font-bold font-mono">05</span>
                </div>
                <div className="bg-secondary/20 p-3 rounded-md border border-border/50">
                  <span className="text-[10px] uppercase block text-muted-foreground">Stops</span>
                  <span className="text-xl font-bold font-mono">01</span>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
                Map View
              </h3>
              <div className="aspect-square bg-zinc-900 rounded-lg border border-border/50 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black opacity-50" />
                <MapPin className="size-8 text-zinc-700 group-hover:text-primary transition-colors" />
                <span className="z-10 text-[10px] uppercase font-medium text-zinc-500">
                  Interactive Map Coming Soon
                </span>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
