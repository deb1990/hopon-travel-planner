'use client';

import { useQuery } from '@tanstack/react-query';
import { TripCard } from '@/components/dashboard/trip-card';
import { CreateTripDialog } from '@/components/dashboard/create-trip-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Compass, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const DEMO_USER_ID = 'b07bb29b-67de-4f35-8c85-111c8358436b';
const API_URL = 'http://localhost:4000';

export default function Dashboard() {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-[2rem] bg-slate-100 dark:bg-slate-900" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-slate-100 dark:border-white/5 bg-white/80 dark:bg-black/80 backdrop-blur-xl px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Compass className="size-5 text-white stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-[1000] tracking-tighter text-slate-900 dark:text-white uppercase">
                Hop On
              </h1>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-[0.3em] -mt-1">
                Travel Planner
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <CreateTripDialog />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-10 pt-16 pb-32">
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="size-4 text-blue-500" />
            <span className="text-[10px] font-black uppercase text-blue-600/50 tracking-[0.2em]">
              Ready to plan
            </span>
          </div>
          <h2 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white uppercase">
            Your Journeys
          </h2>
          <p className="text-slate-400 mt-2 max-w-xl font-medium">
            Organize and manage your travel plans with a clear, detailed timeline.
          </p>
        </div>

        {trips?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip: any) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-32 bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-[4rem] shadow-sm">
            <p className="text-slate-300 font-black uppercase tracking-widest text-xs italic">
              Start by creating your first trip.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
