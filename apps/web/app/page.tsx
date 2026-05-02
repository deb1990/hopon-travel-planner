'use client';

import React from 'react';
import { TripCard } from '@/components/dashboard/trip-card';
import { CreateTripDialog } from '@/components/dashboard/create-trip-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Compass, Sparkles } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Trip } from '@hopon/core';
import { useTrips } from '@/hooks/use-trips';

/**
 * The primary dashboard for managing travel journeys.
 * Handles listing existing trips and initiating new ones.
 */
export default function Dashboard() {
  const { data: trips, isLoading } = useTrips();

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
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-foreground">
            <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Compass className="size-5 text-primary-foreground stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-[1000] tracking-tighter uppercase text-foreground">
                Hop On
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.3em] -mt-1">
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
            <Sparkles className="size-4 text-primary" />
            <span className="text-[10px] font-black uppercase text-primary/50 tracking-[0.2em]">
              Ready to plan
            </span>
          </div>
          <h2 className="text-5xl font-black tracking-tight text-foreground uppercase">
            Your Journeys
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl font-medium text-lg">
            Organize and manage your travel plans with a clear, detailed timeline.
          </p>
        </div>

        {trips && trips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip: Trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-32 bg-muted/20 border border-border rounded-[4rem] border-dashed">
            <p className="text-muted-foreground font-black uppercase tracking-widest text-sm italic">
              Start by creating your first trip.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
