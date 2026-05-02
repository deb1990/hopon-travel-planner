import React from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { EditTripDialog } from '@/components/dashboard/edit-trip-dialog';
import { Trip } from '@hopon/core';

interface ItineraryHeaderProps {
  trip?: Trip;
  tripId: string;
}

/**
 * Sticky header for the trip detail view.
 * Provides professional breadcrumb navigation and mission control actions.
 *
 * @param props.trip - The full trip object for editing.
 * @param props.tripId - Unique identifier for the trip.
 */
export function ItineraryHeader({ trip, tripId }: ItineraryHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl px-8 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors group"
          >
            <ChevronLeft className="size-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Dashboard
          </Link>
          <div className="h-4 w-px bg-border/60" />
          <div className="flex flex-col">
            <h1 className="text-xl font-[1000] tracking-tight text-foreground uppercase italic">
              {trip?.name || 'Exploring...'}
            </h1>
            <span className="text-[9px] text-primary/60 font-mono font-bold tracking-tighter">
              {tripId}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {trip && <EditTripDialog trip={trip} />}
          <div className="w-px h-4 bg-border/60" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
